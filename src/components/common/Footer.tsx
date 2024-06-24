import { AppBar, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import { palette } from '../../theme';
import InstagramIcon from '@mui/icons-material/Instagram';
import IconButton from '@mui/material/IconButton';

const { belDarkCyan, belDarkBeige, belLightBeige } = palette;

const Footer: React.FC = () => {
    return (
        <AppBar position="relative" sx={{ backgroundColor: belDarkCyan, bottom: 0 }}>
            <Toolbar>
                <a href="https://www.instagram.com/bel.lingeriespg/" target="_blank" rel="noopener noreferrer" >
                    <IconButton sx={{ color: belLightBeige }}>
                        <InstagramIcon fontSize='large' />
                    </IconButton>
                </a>
                <Typography variant="h6" sx={{ color: belDarkBeige }}>
                    <Image src="/logo.png" width={100} height={100} alt='Bel Lingeries'></Image>
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Footer;
