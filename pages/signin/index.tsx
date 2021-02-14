import Signin from 'views/Signin';

interface SigninData {
  email: string;
  password: string;
}

const SIGNIN = 'sign_in' as const;
const UPDATE_PASWWORD = 'forgotten_password' as const;

// export function Signin() {
//   const { push } = useRouter();
//   const [authView, setAuthView] = useState<
//     typeof SIGNIN | typeof UPDATE_PASWWORD
//   >(SIGNIN);

//   useEffect(() => {
//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         if (event === 'PASSWORD_RECOVERY') setAuthView(UPDATE_PASWWORD);
//         if (event === 'USER_UPDATED')
//           setTimeout(() => setAuthView(SIGNIN), 1000);
//         if (event === 'SIGNED_IN') setTimeout(() => push('/'), 1000);
//         // Send session to /api/auth route to set the auth cookie.
//         // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
//         fetch('/api/auth', {
//           method: 'POST',
//           headers: new Headers({ 'Content-Type': 'application/json' }),
//           credentials: 'same-origin',
//           body: JSON.stringify({ event, session }),
//         }).then((res) => res.json());
//       }
//     );

//     return () => {
//       authListener && authListener.unsubscribe();
//     };
//   }, []);

//   return (
//     <Main>
//       <Auth
//         supabaseClient={supabase}
//         //providers={['google', 'github']}
//         view={authView}
//         socialLayout="horizontal"
//         socialButtonSize="xlarge"
//       />
//     </Main>
//   );
// }

export default Signin;
