import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    pixelBasedPreset,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL!;

interface CertificateStatusEmailProps {
    studentName: string;
    courseName: string;
    status: 'approved' | 'rejected';
    reason?: string | null;
}

export const CertificateStatusEmail = ({ studentName, courseName, status, reason }: CertificateStatusEmailProps) => {
    const approved = status === 'approved';

    return (
        <Html>
            <Head />
            <Tailwind
                config={{
                    presets: [pixelBasedPreset],
                    theme: {
                        extend: {
                            colors: { brand: '#6a1b9a', offwhite: '#fafbfb' },
                            spacing: { 0: '0px', 20: '20px', 45: '45px' },
                        },
                    },
                }}
            >
                <Preview>{approved ? 'Your certificate is ready to download' : 'Update on your certificate request'}</Preview>
                <Body className="bg-offwhite font-sans text-base">
                    <Img
                        src='https://res.cloudinary.com/asifatkazeem/image/upload/v1766900704/mkk11iymqwpcrkvcmq7o.jpg'
                        width="100"
                        height="100"
                        alt="WSH Logo"
                        className="mx-auto my-20"
                    />
                    <Container className="bg-white p-45">
                        <Heading className="my-0 text-center leading-8">
                            {approved ? 'Your Certificate Is Ready 🎉' : 'Certificate Request Update'}
                        </Heading>
                        <Section>
                            <Text className="text-base">Hello <strong>{studentName}</strong>,</Text>
                            {approved ? (
                                <Text className="text-base">
                                    Congratulations! Your certificate request for <strong>{courseName}</strong> has been approved.
                                    You can download your certificate from the Certificates page of your dashboard at any time.
                                </Text>
                            ) : (
                                <>
                                    <Text className="text-base">
                                        Your certificate request for <strong>{courseName}</strong> could not be approved yet. Here is the feedback from our team:
                                    </Text>
                                    <Text className="rounded-lg bg-offwhite p-20 text-base italic">{reason}</Text>
                                    <Text className="text-base">
                                        Please address the feedback above and re-submit your request from the Certificates page.
                                    </Text>
                                </>
                            )}
                        </Section>
                        <Section className="text-center">
                            <Link href={`${baseUrl}/learners/certificates`} className="rounded-lg bg-brand px-[18px] py-3 text-white">
                                {approved ? 'Download your certificate' : 'Re-submit your request'}
                            </Link>
                        </Section>
                    </Container>
                    <Container className="mt-20">
                        <Text className="mb-45 text-center text-gray-400">
                            Alagbole, Ojodu Berger, Lagos.
                            <br /> &copy; {new Date().getFullYear()} WSH. All rights reserved.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default CertificateStatusEmail;
