import { useState, type FormEvent } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Hook up to your API / ESP when ready
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-[60px] w-[322px] shrink-0 items-center gap-[30px] rounded-[90px] bg-[#17171b] py-[5px] pl-[20px] pr-[5px]"
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        autoComplete="email"
        required
        placeholder="Your mail here"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="text-body-2 h-[21px] w-[150px] min-w-0 shrink-0 border-0 bg-transparent text-white outline-none placeholder:text-[#b3b3b3] focus:ring-0"
      />
      <button
        type="submit"
        className="flex h-[50px] w-[117px] shrink-0 cursor-pointer items-center justify-center gap-[10px] rounded-[500px] bg-[#1447e6] px-[28px] py-[16px] transition-opacity hover:opacity-90"
      >
        <span className="text-btn [word-break:break-word] shrink-0 text-center capitalize text-white">
          Join Now
        </span>
      </button>
    </form>
  );
}
