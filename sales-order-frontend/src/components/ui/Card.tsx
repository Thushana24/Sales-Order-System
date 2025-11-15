import { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

const Card = ({
  title,
  subtitle,
  children,
  className = "",
  actions,
}: CardProps) => {
  return (
    <div className={`rounded-lg bg-white shadow-md ${className}`}>
      {(title || actions) && (
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

export default Card;
