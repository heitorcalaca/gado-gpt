import Link from "next/link";

export default function KPIIndicator({ title, count, link, color }) {
  return (
    <Link href={link}>
      <div
        className={`p-6 rounded-lg shadow-lg ${color} text-white cursor-pointer`}
      >
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-4 text-4xl font-semibold">{count}</p>
      </div>
    </Link>
  );
}
