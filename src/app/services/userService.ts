import toast from "react-hot-toast";

export const uploadUserPhoto = async (
  file: File,
  fallbackPreview?: string
): Promise<string | null> => {
  const token = localStorage.getItem("userToken");
  if (!token) return null;

  const formData = new FormData();
  formData.append("photo", file);

  try {
    const res = await fetch(
      "https://linked-posts.routemisr.com/users/upload-photo",
      {
        method: "PUT",
        headers: { token },
        body: formData,
      }
    );

    const contentType = res.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      const text = await res.text();
      throw new Error("Unexpected response:\n" + text);
    }

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");

    const newPhoto = data?.user?.photo || data?.photo || fallbackPreview;

    if (!newPhoto) {
      console.warn("Upload success but no photo returned");
      toast.success("Profile photo updated, but no image returned");
    } else {
      toast.success("Profile photo updated");
    }

    return newPhoto;
  } catch (err: any) {
    toast.error(err.message || "Upload failed");
    return null;
  }
};

export async function updatePassword(
  current: string,
  newPass: string,
  token: string
): Promise<void> {
  const res = await fetch(
    "https://linked-posts.routemisr.com/users/change-password",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        token,
      },
      body: JSON.stringify({
        password: current,
        newPassword: newPass,
      }),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    let errorMessage = "Failed to change password";
    if (data?.message) {
      errorMessage = data.message;
    } else if (Array.isArray(data?.errors)) {
      errorMessage = data.errors[0]?.msg || errorMessage;
    }
    throw new Error(errorMessage);
  }
}
