import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import {
    RecoilRoot
} from 'recoil';
import { ThemeProvider } from 'emotion-theming';
import preset from '@rebass/preset';

import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/pl';

//Moment settings
Moment.globlLocale = 'pl';
Moment.globalFormat = 'dd - DD.MM.Y, H:mm';
Moment.globalTimezone = 'Europe/Warsaw';
Moment.globalLocal = true;

//Additional theming
const correctedTheme = {
    ...preset,
    breakpoints: [
        '40em', '52em', '64em',
    ],
    shadows: {
        ...preset.shadows,
        hardShort: '0px 3px 2px 0px rgba(0,0,0,0.3)'
    },
    buttons: {
        ...preset.buttons,
        todosActions: {
            bg: 'whitesmoke',
            color: 'grey',
            cursor: 'pointer'
        },
        addButton: {
            display: 'block',
            width: '100%',
            bg: 'whitesmoke',
            color: 'text',
            cursor: 'pointer',
            border: '1px solid black',
            transitionDuration: '.3s',
            ':hover': {
                bg: 'whitesmoke',
                boxShadow: 'hardShort'
            }
        },
        smallButton: {
            fontSize: '12px',
            cursor: 'pointer',
            transitionDuration: '.3s',
            ':hover': {
                boxShadow: 'hardShort'
            }
        }
    },
    fontWeights: {
        ...preset.fontWeights,
        heading: '300'
    },
    variants: {
        ...preset.variants,
        newTaskBox: {
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            button: {
                bg: 'whitesmoke',
                display: 'block',
                width: '100%',
                height: '100%',
                color: 'text',
                cursor: 'pointer',
                borderBottom: '1px solid black',
                borderRight: '1px solid black',
                borderTop: '1px solid black',
                borderTopLeftRadius: '0px',
                borderBottomLeftRadius: '0px',
                transitionDuration: '.3s',
                ':hover': {
                    bg: 'whitesmoke',
                    boxShadow: 'hardShort'
                }
            }
        },
        todoElem: {
            padding: '15px 15px 35px 15px',
            marginBottom: '1.5rem',
            boxShadow: 'hardShort',
            bg: 'whitesmoke',
            position: 'relative',
            cursor: 'pointer'
        },
        tinyTextBottom: {
            position: 'absolute',
            bottom: '3px',
            color: 'grey',
            fontSize: '12px'
        },
        todoElemRight: {
            padding: ['0px 5px', '0px 15px', '0px 15px'],
            flexWrap: 'nowrap',
            justifyContent: ['flex-end', 'space-between', 'space-between']
        },
        tinyText: {
            color: 'grey',
            fontSize: '12px'
        },
        infoFrame: {
            fontSize: '14px',
            border: '1px solid black',
            padding: '12px',
            borderRadius: '4px',
            bg: 'whitesmoke'
        }
    }
};

//Define custom AppWrapper to use Context Providers and global props
function AppWrapper({ Component, pageProps }) {
    return <RecoilRoot>
        <ThemeProvider theme={correctedTheme}>
            <Component {...pageProps} />
        </ThemeProvider>
    </RecoilRoot>
}

export default AppWrapper;