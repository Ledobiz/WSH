import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    pixelBasedPreset,
    Row,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

export const ContactUsEmail = ({message}: {message: string}) => {
    return (
        <Html>
            <Head />
            <Tailwind
                config={{
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
                <Preview>New Contact Us Message</Preview>
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
                            New Contact Us Message
                        </Heading>

                        <Section>
                            <Row>
                                <Text className="text-base">
                                    { message }
                                </Text>
                            </Row>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ContactUsEmail;
