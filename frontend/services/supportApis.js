export const supportRequestsApi = async (formData) => {
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
    throw new Error(data.message || "Unable to send your support request");
  }

  return data;
};
