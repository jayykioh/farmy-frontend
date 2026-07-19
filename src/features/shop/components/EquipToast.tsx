import React from 'react';

interface EquipToastProps {
  type: 'equip' | 'unequip';
  itemName: string;
  itemImageUrl: string;
}

/**
 * Rich toast content for equip/unequip events.
 * Designed to be used with react-hot-toast custom JSX:
 *
 *   toast.custom((t) => <EquipToast ... />)
 */
export const EquipToast: React.FC<EquipToastProps> = ({
  type,
  itemName,
  itemImageUrl,
}) => {
  const isEquip = type === 'equip';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: isEquip ? '#f2fcf5' : '#fefce8',
        border: `1px solid ${isEquip ? '#e0f6e8' : '#fef3c7'}`,
        borderRadius: '100px',
        padding: '10px 20px 10px 10px',
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
        maxWidth: '360px',
        animation: 'equip-toast-enter 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Item thumbnail */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: '#ffffff',
          border: `2px solid ${isEquip ? '#08A855' : '#d97706'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          boxShadow: isEquip
            ? '0 0 0 3px rgba(8, 168, 85, 0.15)'
            : '0 0 0 3px rgba(217, 119, 6, 0.15)',
        }}
      >
        <img
          src={itemImageUrl}
          alt={itemName}
          style={{
            width: '28px',
            height: '28px',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 800,
            color: isEquip ? '#067a3d' : '#92400e',
            lineHeight: 1.3,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {isEquip ? `Đã trang bị ${itemName}!` : `Đã tháo ${itemName}`}
        </p>
        <p
          style={{
            margin: '2px 0 0',
            fontSize: '11px',
            fontWeight: 600,
            color: isEquip ? '#08A855' : '#d97706',
            opacity: 0.8,
          }}
        >
          {isEquip ? '✨ Bé Thóc thích lắm!' : '😢 Bé Thóc hơi buồn...'}
        </p>
      </div>
    </div>
  );
};
