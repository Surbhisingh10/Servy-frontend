interface PlatformBadgeProps {
  platform?: string;
}

const styles: Record<string, string> = {
  DIRECT: 'bg-gray-100 text-gray-700',
  SWIGGY: 'bg-orange-100 text-orange-700',
  ZOMATO: 'bg-red-100 text-red-700',
  DINEOUT: 'bg-blue-100 text-blue-700',
};

export default function PlatformBadge({ platform = 'DIRECT' }: PlatformBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${styles[platform] || styles.DIRECT}`}>
      {platform}
    </span>
  );
}

