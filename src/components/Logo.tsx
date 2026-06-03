export default function Logo({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      width="28" 
      height="28" 
      viewBox="0 0 28 28" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M14 2L2 9L14 16L26 9L14 2Z" 
        fill="var(--color-ember)" 
      />
      <path 
        d="M2 19L14 26L26 19M2 14L14 21L26 14" 
        stroke="var(--color-ember)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ opacity: 0.6 }}
      />
    </svg>
  );
}
