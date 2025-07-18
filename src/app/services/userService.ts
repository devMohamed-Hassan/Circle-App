import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
      `${API_BASE_URL}/users/upload-photo`,
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
  } catch (err: unknown) {
    if (err && typeof err === "object" && "message" in err) {
      toast.error((err as { message?: string }).message || "Upload failed");
    } else {
      toast.error("Upload failed");
    }
    return null;
  }
};

export async function updatePassword(
  current: string,
  newPass: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${API_BASE_URL}/users/change-password`,
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
