(function () {
  const apiUrl = () => {
    const baseUrl = window.apiConfig?.baseUrl;
    if (!baseUrl) {
      throw new Error("Isi URL backend di frontend/api-config.js.");
    }

    const backendUrl = new URL(baseUrl);
    const isLocalHttp = backendUrl.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(backendUrl.hostname);
    if (backendUrl.protocol !== "https:" && !isLocalHttp) {
      throw new Error("URL backend harus menggunakan HTTPS kecuali untuk localhost.");
    }

    return backendUrl.href.replace(/\/+$/, "");
  };

  const getUserToken = async (user = window.siteCurrentUser) => {
    if (!user) throw new Error("Login diperlukan untuk mengakses video yang disukai.");
    return user.getIdToken();
  };

  const request = async (path, { method = "GET", body } = {}, user) => {
    const token = await getUserToken(user);
    const headers = {
      Authorization: `Bearer ${token}`
    };

    if (body) headers["Content-Type"] = "application/json";

    const response = await fetch(`${apiUrl()}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    const responseBody = await response.text();
    if (!response.ok) {
      let message = responseBody;
      try {
        message = JSON.parse(responseBody).error || responseBody;
      } catch {}
      throw new Error(`Backend request failed (${response.status}): ${message}`);
    }

    return responseBody ? JSON.parse(responseBody) : [];
  };

  const list = (user) => request("/api/liked-videos", {}, user);

  const upsertMany = async (records, user = window.siteCurrentUser) => {
    if (!Array.isArray(records)) throw new TypeError("Daftar video yang disukai harus berupa array.");
    if (records.length === 0) return;
    if (!user) throw new Error("Login diperlukan untuk menyimpan video yang disukai.");

    records.forEach((record) => {
      if (!record.video_key || !record.video_src) {
        throw new Error("Data video harus memiliki video_key dan video_src.");
      }
    });

    await request("/api/liked-videos", { method: "POST", body: records }, user);
  };

  const remove = async (videoKey, user) => {
    if (!videoKey) throw new TypeError("Kunci video wajib diisi.");
    const query = new URLSearchParams({ video_key: videoKey });
    await request(`/api/liked-videos?${query}`, { method: "DELETE" }, user);
  };

  window.likedVideosApi = Object.freeze({ list, upsertMany, remove });
})();
