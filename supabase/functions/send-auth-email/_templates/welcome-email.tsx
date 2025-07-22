import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  supabase_url: string
  email_action_type: string
  redirect_to: string
  token_hash: string
  token: string
  user_email: string
}

export const WelcomeEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
  user_email,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirmez votre compte admin - raccordement-elec.fr</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔐 Confirmation de votre compte</Heading>
        
        <Text style={text}>
          Bienvenue sur le tableau de bord administrateur de <strong>raccordement-elec.fr</strong> !
        </Text>
        
        <Text style={text}>
          Pour confirmer votre compte et accéder au dashboard admin, cliquez sur le bouton ci-dessous :
        </Text>

        <Section style={buttonContainer}>
          <Link
            href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
            style={button}
          >
            Confirmer mon compte
          </Link>
        </Section>

        <Text style={text}>
          Ou copiez et collez ce lien dans votre navigateur :
        </Text>
        
        <Text style={linkText}>
          {`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          <strong>Code de vérification :</strong> {token}
        </Text>

        <Text style={footer}>
          Si vous n'avez pas créé ce compte, vous pouvez ignorer cet email en toute sécurité.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          <strong>raccordement-elec.fr</strong><br />
          Votre partenaire pour tous vos raccordements électriques<br />
          📞 09 77 40 50 60 | 📧 contact@raccordement-elec.fr
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
}

const h1 = {
  color: '#1e293b',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  lineHeight: '42px',
  textAlign: 'center' as const,
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
  lineHeight: '100%',
}

const linkText = {
  color: '#2563eb',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
  padding: '16px',
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
  textAlign: 'center' as const,
}