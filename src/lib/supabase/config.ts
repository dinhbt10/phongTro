// Cấu hình Supabase CÔNG KHAI (URL + anon key).
// 2 giá trị này VỐN public: anon key được thiết kế để lộ ra trình duyệt
// (đằng nào cũng nằm trong bundle JS phía client), dữ liệu được bảo vệ bằng RLS.
// Hardcode để deploy chạy ngay mà không cần khai báo env trên Vercel.
// Vẫn ưu tiên biến môi trường nếu có (vd đổi sang project Supabase khác).
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://opjuizadhyqfmsxpcjag.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wanVpemFkaHlxZm1zeHBjamFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTU4MDAsImV4cCI6MjA5NTI5MTgwMH0.36PuSlDHTLLBNg7P6v641axATSlVpfgp9vs8pVBJtrY";
