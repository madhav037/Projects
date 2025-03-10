// lib/authGuard.ts
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import jwt from 'jsonwebtoken';
import nookies from 'nookies';

//makes sure no one can access the page without being logged in
//from GPT
export function withAuthGuard(gssp: GetServerSideProps) {
    return async (context: GetServerSidePropsContext) => {
        const cookies = nookies.get(context);
        const token = cookies.token;

        console.log(token);

        if (!token) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }

        try {
            // Decode the token to get the user data
            const decoded = jwt.verify(token, process.env.SECRET_KEY as string);
            
            // Call the provided getServerSideProps and pass the decoded user data in `props`
            const result = await gssp(context);
            if ('props' in result) {
                return {
                    ...result,
                    props: {
                        ...result.props,
                        user: decoded,
                    },
                };
            }
            return result;
        } catch (error) {
            return {
                redirect: {
                    destination: '/login',
                    permanent: false,
                },
            };
        }
    };
}

/* 
put this on top of all the pages that you want to protect

export const getServerSideProps: GetServerSideProps = withAuthGuard(async (context) => {
    return {
        props: {}, // No need to add user data here; it’s already handled by `withAuthGuard`
    };
});

eg.
import { GetServerSideProps } from 'next';
import { withAuthGuard } from '../lib/authGuard';

export const getServerSideProps: GetServerSideProps = withAuthGuard(async (context) => {
    return {
        props: {}, // No need to add user data here; it’s already handled by `withAuthGuard`
    };
});

const Profile = ({ user }: { user: any }) => {
    return (
        <div>
            <h1>Welcome, {user.email}</h1>
            <p>This is your profile page.</p>
        </div>
    );
};
*/