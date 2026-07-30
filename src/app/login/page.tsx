"use client";

import { useActionState } from "react";
import { authenticate } from "@/app/login/actions";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin login</h1>
      <p className="mt-1 text-sm text-gray-500">
        Sign in to manage NimbusTech inventory and orders.
      </p>

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>

        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 rounded-md bg-gray-100 p-3 text-xs text-gray-500">
        Demo credentials: <strong>admin@nimbustech.demo</strong> /{" "}
        <strong>NimbusAdmin123!</strong>
      </p>
    </div>
  );
}
