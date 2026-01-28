import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Preview,
  pixelBasedPreset,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface PasswordResetEmailProps {
    userName: string;
    token: string;
    email: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? process.env.NEXT_PUBLIC_APP_URL
  : '';

export const PasswordResetEmail = ({
  userName,
  email,
  token,
}: PasswordResetEmailProps) => {
    return (
        <Html>
            <Head />
            <Tailwind config={{
                presets: [pixelBasedPreset],
                theme: {
                    extend: {
                    colors: {
                        brand: '#6a1b9a',
                        offwhite: '#fafbfb',
                    },
                    spacing: {
                        0: '0px',
                        20: '20px',
                        45: '45px',
                    },
                    },
                },
                }}
            >
                <Body className="bg-[#6a1b9a] py-2.5">
                    <Preview>Women Skills Hub reset your password</Preview>
                    <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
                        <Img
                            src='https://res.cloudinary.com/asifatkazeem/image/upload/v1766900704/mkk11iymqwpcrkvcmq7o.jpg'
                            width="40"
                            height="33"
                            alt="Women Skills Hub"
                        />
                        <Section>
                            <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                                Hi {userName},
                            </Text>
                            <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                                Someone recently requested a password change for your Women Skills Hub
                                account. If this was you, you can set a new password here:
                            </Text>
                            <Button
                                className="bg-[#6a1b9a] rounded text-white text-[15px] no-underline text-center font-dropbox-sans block w-[210px] py-[14px] px-[7px]"
                                href={`${baseUrl}/change-password?token=${token}&email=${encodeURIComponent(email)}`}
                            >
                                Reset password
                            </Button>
                            <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                                If you don&apos;t want to change your password or didn&apos;t
                                request this, just ignore and delete this message.
                            </Text>
                            <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                                To keep your account secure, please don&apos;t forward this
                                email to anyone.
                            </Text>
                            <Text className="text-base font-dropbox font-light text-[#404040] leading-[26px]">
                                Warm Regards,
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default PasswordResetEmail;
