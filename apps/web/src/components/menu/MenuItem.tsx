import React from 'react';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { styled } from '@mui/material';
import ListItemIcon from '@mui/material/ListItemIcon';

const CustomListItemIcon = styled(ListItemIcon)({
    minWidth: '2.25rem',
});

interface MenuItemProps {
    icon: SvgIconComponent;
    text: string;
    onClick: () => void;
}

export default function MenuItem({ icon: Icon, text, onClick }: MenuItemProps) {
    return (
        <ListItem disablePadding>
            <ListItemButton onClick={onClick}>
                <CustomListItemIcon>
                    <Icon />
                </CustomListItemIcon>
                <ListItemText primary={text} />
            </ListItemButton>
        </ListItem>
    );
}
