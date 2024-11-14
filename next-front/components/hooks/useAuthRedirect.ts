import { useEffect } from "react";

// export default function useAuthRedirect() {
//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         console.log(token, "Redirect");
//         if (token) {
//             window.location.href = "/admin";
//         }
//       }, [])
//   }

export default function useAuthRedirect() {
    const token = localStorage.getItem("token");
    console.log(token, "Redirect");
    if (token) {
        window.location.href = "/admin";
    }
  }