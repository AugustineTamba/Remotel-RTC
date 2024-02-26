import { EuiAvatar } from '@elastic/eui';
import React from 'react'
import { useAppSelector } from '../../app/hooks';
import mylogo from '../../assets/user.png';

function HeaderAvatar({
    size,
    name,
    imageUrl,
} : {
    size: "s" | "m" | "l" | "xl" | undefined;
    name: string | undefined;
    imageUrl: string | undefined;
}) {
    const imageUrl2 = useAppSelector((zoom) => zoom.auth.userInfo?.imageUrl);
    const imageUrl1 = mylogo;

  return (
    
    <EuiAvatar
        size={size}
        name={name || 'R'}
        imageUrl={imageUrl2 ? imageUrl2 : imageUrl1 }
        color="#FFF"
    />
  )
}

export default HeaderAvatar
