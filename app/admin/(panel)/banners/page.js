import { getSettings } from "@/lib/store";
import { saveSettingsAction } from "../../actions";
import SaveForm from "../SaveForm";
import GalleryInput from "../GalleryInput";

export default async function BannersPage() {
  const s = await getSettings();
  const images = s.gallery.split("\n").map((x) => x.trim()).filter(Boolean);

  return (
    <>
      <h1 className="adm-title">ব্যানার</h1>
      <p className="adm-muted adm-intro">
        ল্যান্ডিং পেজের বড় ছবিগুলো। <b>১ম ছবি</b> = উপরের হিরো ছবি (মডেল + প্রোডাক্ট, ব্যাকগ্রাউন্ড ছাড়া PNG হলে সবচেয়ে ভালো),
        <b>২য় ছবি</b> = “আগে / এখন” ছবি। ← → দিয়ে ক্রম বদলান।
        মুছে “সেভ করুন” চাপলে ছবি স্টোরেজ থেকেও মুছে যাবে।
      </p>

      <div className="adm-box">
        <SaveForm action={saveSettingsAction}>
          <GalleryInput name="gallery" defaultValue={images} />
        </SaveForm>
      </div>
    </>
  );
}
