import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Đăng nhập",
};

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Đăng nhập quản trị</CardTitle>
          <CardDescription>
            Khu vực dành cho quản trị viên kho phòng trọ.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* useSearchParams cần Suspense boundary */}
          <Suspense>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
