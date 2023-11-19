import { ImageLoaderProps } from "next/image";
const normalizeSrc = (src) => (src[0] === "/" ? src.slice(1) : src);
export function getCloudinaryImageLoader({ src, width, quality, }) {
    const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
    return `https://cdn.sushi.com/image/upload/${params.join(",")}/${normalizeSrc(src)}`;
}
//# sourceMappingURL=getCloudinaryImageLoader.js.map