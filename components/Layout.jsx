// 文件: /components/Layout.js

import { Fade } from "@mui/material";

export default function Layout({ children }) {
  return (
    <Fade in={true}>
      <div
        style={{
          minHeight: "100vh",
          gap: "6vw",
          background: `linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('/swapgo/background.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {children}
      </div>
    </Fade>
  );
};