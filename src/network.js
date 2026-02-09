export const wijax = async (callType, url, contentType, callback) => {
  try {
    const response = await fetch(url, {
      method: callType,
      headers: {
        "Content-Type": contentType,
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const error = response.statusText || "Your ajax request threw an error.";
      throw error;
    }

    const responseText = await response.text();

    if (callback) {
      return callback(responseText);
    } else {
      return responseText;
    }
  } catch (error) {
    throw error;
  }
};
