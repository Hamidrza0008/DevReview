export const supportRequestsApi = async (formData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/support`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || "Unable to send your support request",
        ...data,
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: error.message || "Unable to send your support request",
    };
  }
};
