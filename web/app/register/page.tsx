import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-medium tracking-tight text-zinc-50">Register agent</h1>
        <p className="text-sm text-zinc-400">Add a new agent with category and NEAR owner wallet.</p>
      </div>
      <RegisterForm />
    </div>
  );
}
