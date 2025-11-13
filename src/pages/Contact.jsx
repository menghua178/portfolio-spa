// src/pages/Contact.jsx
import { useForm } from "react-hook-form";
import { contactAPI } from "../services/api";
import { useState } from "react";

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await contactAPI.sendMessage(data);
      setMessage("Message sent successfully!");
      reset();
    } catch (err) {
      setMessage("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Me</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full p-2 border rounded"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email" } })}
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-2">Message</label>
          <textarea
            {...register("message", { required: "Message is required" })}
            rows="4"
            className="w-full p-2 border rounded"
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
        {message && <p className="text-center mt-4 text-green-500">{message}</p>}
      </form>
    </div>
  );
};

export default Contact;