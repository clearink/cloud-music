//第二版懒加载依赖于 IntersectionObserver
import React, { useEffect, useRef } from "react";
// import { throttle } from "@/utils"45;
function ImgLazyLoad({ children, data }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const imgs = [...imgRef.current.querySelectorAll("img")];

    const io = new IntersectionObserver(entries => {
      entries.forEach(item => {
        const dom = item.target;
        if (item.isIntersecting) {
          dom.src = dom.dataset.src;
          delete dom.dataset.src;
          io.unobserve(dom);
        }
      });
    });
    imgs.forEach(img => {
      if (img.dataset.src) {
        io.observe(img);
      }
    });
    return () => {
      io.disconnect();
    };
  }, [data]);

  return (
    <children.type {...children.props} ref={imgRef}>
      {children.props.children}
    </children.type>
  );
}

export default ImgLazyLoad;

// 第一版懒加载要依赖于scroll
// import React, { useEffect, useRef, forwardRef} from "react";
// import { throttle } from "@/utils";
// function ImgLazyLoad({ children },ref) {
//   const scrollRef = useRef(null);
//   const handleScroll = throttle(e => {
//     if (!ref.current) return;
//     [...ref.current.getElementsByTagName("img")].forEach(item => {
//       const imgSize = item.getBoundingClientRect();
//       if (item.dataset.src && imgSize.top < document.body.clientHeight) {
//         item.src = item.dataset.src;
//         delete item.dataset.src;
//       }
//     });
//   },200);
//   useEffect(() => {
//     handleScroll();
//     const scrollEle = scrollRef.current.parentNode;
//     scrollEle.addEventListener("scroll", handleScroll);
//     return () => {
//       scrollEle.removeEventListener("scroll", handleScroll);
//     };
//   }, [handleScroll, scrollRef]);

//   return (
//     <children.type {...children.props} ref={scrollRef}>
//       {children.props.children}
//     </children.type>
//   );
// }

// export default forwardRef(ImgLazyLoad);
