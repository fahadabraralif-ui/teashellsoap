import { getSettings } from "@/lib/store";
import Link from "next/link";
import { PAGES, getContent } from "@/lib/content";
import { saveContentAction } from "../../actions";
import SaveForm from "../SaveForm";
import ImageInput from "../ImageInput";
import ResetContent from "./ResetContent";

// Ekta list (feature, perfume, pros...) er item gulo — sheshe ekta faka ghor notun item jog korar jonno
function ListFields({ list, items }) {
  const rows = [...items, Object.fromEntries(list.fields.map(([f]) => [f, ""]))];
  const hasImage = list.fields.some(([, , kind]) => kind === "image");
  return (
    <div className="content-list">
      <h4>{list.title} <small className="adm-muted">(সব ঘর খালি করলে ওই আইটেম মুছে যাবে, শেষের খালি ঘরে নতুন যোগ করুন)</small></h4>
      {rows.map((item, i) => (
        <div key={i} className={`content-item ${i === items.length ? "new" : ""}`}>
          <span className="content-num">{i === items.length ? "➕ নতুন" : `#${i + 1}`}</span>
          {item.image !== undefined && !hasImage && <input type="hidden" name={`l.${list.key}.${i}.image`} defaultValue={item.image} />}
          {list.fields.map(([f, label, long]) => long === "image" ? (
            // label er bhetore button rakhle label e click korle button chaape — tai div
            <div key={f} className="content-img">
              {label}
              <ImageInput name={`l.${list.key}.${i}.${f}`} defaultValue={item[f] || ""} folder="products" />
            </div>
          ) : (
            <label key={f}>
              {label}
              {long ? (
                <textarea name={`l.${list.key}.${i}.${f}`} defaultValue={item[f] || ""} rows={2} />
              ) : (
                <input name={`l.${list.key}.${i}.${f}`} defaultValue={item[f] || ""} />
              )}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

export default async function ContentPage({ searchParams }) {
  const { page: pageParam } = await searchParams;
  const pageId = PAGES[pageParam] ? pageParam : "home";
  const page = PAGES[pageId];
  const s = await getSettings();
  const { text, lists } = getContent(s, pageId);

  return (
    <>
      <div className="adm-title-row">
        <h1 className="adm-title">ল্যান্ডিং পেজ টেক্সট</h1>
        <ResetContent page={pageId} />
      </div>
      {/* Kon landing page er lekha edit hobe */}
      <div className="range-tabs content-pages">
        {Object.entries(PAGES).map(([id, p]) => (
          <Link key={id} href={`/admin/content?page=${id}`} className={id === pageId ? "active" : ""}>{p.label}</Link>
        ))}
        <a href={page.path} target="_blank" rel="noopener noreferrer">↗ পেজ দেখুন ({page.path})</a>
      </div>
      <div className="adm-box content-help">
        <b>✍️ কীভাবে লিখবেন</b>
        <ul className="fraud-always">
          <li>প্রতিটি অংশ আলাদা — যে অংশ বদলাবেন সেই বক্সের <b>সেভ করুন</b> চাপুন, সাথে সাথে সাইটে বদলে যাবে।</li>
          <li>
            দাম লিখতে <code>{"{price}"}</code> লিখুন — পণ্যের দাম বদলালে লেখাও নিজে বদলাবে। আরও আছে:{" "}
            <code>{"{old_price}"}</code> <code>{"{save}"}</code> <code>{"{off}"}</code> <code>{"{brand}"}</code>{" "}
            <code>{"{inside}"}</code> <code>{"{outside}"}</code> <code>{"{free_boxes}"}</code>
          </li>
          <li>হেডিংয়ে <code>[ ]</code> এর ভেতরের লেখা গোলাপি হাইলাইট হয় — যেমন: [স্কিন ব্রাইটেনিং] সোপ</li>
        </ul>
      </div>

      {page.sections.map((sec) => (
        <details key={`${pageId}-${sec.id}`} className="adm-box content-sec" open={sec.id === "hero"}>
          <summary><h3>{sec.title}</h3></summary>
          <SaveForm action={saveContentAction}>
            <input type="hidden" name="page" value={pageId} />
            <div className="content-grid">
              {sec.fields.map(([k, label, , long]) => long === "image" ? (
                <div key={k} className="content-img wide">
                  {label}
                  <ImageInput name={`t.${k}`} defaultValue={text[k] || ""} folder="products" />
                </div>
              ) : (
                <label key={k} className={long ? "wide" : ""}>
                  {label}
                  {long ? (
                    <textarea name={`t.${k}`} defaultValue={text[k]} rows={3} />
                  ) : (
                    <input name={`t.${k}`} defaultValue={text[k]} />
                  )}
                </label>
              ))}
            </div>
            {sec.list && <ListFields list={sec.list} items={lists[sec.list.key]} />}
            {sec.list2 && <ListFields list={sec.list2} items={lists[sec.list2.key]} />}
          </SaveForm>
        </details>
      ))}
    </>
  );
}
