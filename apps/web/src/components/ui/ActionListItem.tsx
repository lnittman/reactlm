import React from 'react';

interface ActionListItemProps {
  icon?: React.ReactNode;
  children?: React.ReactNode;
  href?: string;
  target?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLAnchorElement>;
  className?: string;
  date?: string;
  badge?: React.ReactNode;
  description?: React.ReactNode;
}

export function ActionListItem({ 
  icon = '⊹', 
  children, 
  href, 
  target, 
  onClick, 
  className = '',
  date,
  badge,
  description
}: ActionListItemProps) {
  const baseClass = `action-list-item ${className}`;
  
  const content = (
    <>
      <div className="action-list-item-main">
        <figure className="action-list-item-icon">{icon}</figure>
        <div className="action-list-item-content">
          <span className="action-list-item-text">{children}</span>
          {description && (
            <span className="action-list-item-description">{description}</span>
          )}
        </div>
      </div>
      {(date || badge) && (
        <div className="action-list-item-meta">
          {badge && <span className="action-list-item-badge">{badge}</span>}
          {date && <span className="action-list-item-date">{date}</span>}
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <a className={baseClass} href={href} target={target} tabIndex={0} role="link">
        {content}
      </a>
    );
  }

  return (
    <div className={baseClass} onClick={onClick} tabIndex={0} role="button">
      {content}
    </div>
  );
}