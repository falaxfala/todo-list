import {
    RecoilRoot
} from 'recoil';
import { ThemeProvider } from 'emotion-theming';
import preset from '@rebass/preset';

import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';
import 'moment-timezone';
import 'moment/locale/pl';

//Moment settings
Moment.globlLocale = 'pl';
Moment.globalFormat = 'dd - DD.MM.Y, H:m';
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
                bg: 'white',
                display: 'block',
                width: '100%',
                height: '100%',
                color: 'text',
                cursor: 'pointer',
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
        momentDate: {
            position: 'absolute',
            bottom: '3px',
            color: 'grey',
            fontSize: '12px'
        },
        todoElemRight: {
            padding: ['0px 5px', '0px 15px', '0px 15px'],
            flexWrap: 'nowrap',
            justifyContent: ['flex-end', 'space-between', 'space-between']
        }
    }
};

//Define custom AppWrapper to use Context Providers and global props
function AppWrapper({ Component, pageProps }) {
    pageProps.todoAPI = 'https://gorest.co.in/public-api/todos';
    return <RecoilRoot>
        <ThemeProvider theme={correctedTheme}>
            <Component {...pageProps} />
        </ThemeProvider>
    </RecoilRoot>
}

export default AppWrapper;