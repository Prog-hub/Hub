const config = {
        prod: {
            server: {
                protocol: 'http',
                ip: '10.242.34.255',//'127.0.0.1';//'10.242.34.255';
                port: '3000'
            }
        },

        debug: {
            server: {
                protocol: 'http',
                ip: '127.0.0.1',//'127.0.0.1'
                port: '3000'
            }
        },

        test: {
            server: {
                protocol: 'http',
                ip: '127.0.0.1',//'127.0.0.1';//'10.242.34.255';
                port: '4000'
            }
        }
    };

export const { server } = config['debug'];
export default config;
