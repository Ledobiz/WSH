import {
    Body,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    pixelBasedPreset,
    Row,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : '';

export const ConfirmationEmail = ({studentName, courseName}: {studentName: string, courseName: string}) => {
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
                <Preview>WSH Welcome</Preview>
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
                            Order Confirmation
                        </Heading>

                        <Section>
                            <Row>
                                <Text className="text-base">
                                    Congratulations <strong>{studentName}</strong>! Your enrolment to the course <strong>{courseName}</strong> was successful.
                                </Text>

                                <Text className="text-base">Here's how to get started:</Text>
                            </Row>
                        </Section>

                        <ul>
                            <li className="mb-20">
                                <strong>Sign into your student dashboard.</strong>{' '}
                                <Link>Using your email and password</Link>, or simply reset them if you forgot.
                            </li>
                            <li className="mb-20">
                                <strong>Locate your course on the My Courses page.</strong>{' '}
                                The lectures are organized sequentially for your learning convenience, it is completely up to you to decide how to navigate through them.
                                i.e. You learn at your own pace!
                            </li>
                            <li className="mb-20">
                                <strong>Student Support</strong> Your tutor is available to assist you throughout your learning journey. Feel free to reach out via the platform's messaging system whenever you need help or have questions. 
                            </li>
                        </ul>

                        <Section className="text-center">
                            <Link href={`${baseUrl}/learners/dashboard`} className="rounded-lg bg-brand px-[18px] py-3 text-white">
                                Go to your dashboard
                            </Link>
                        </Section>
                    </Container>

                    <Container className="mt-20">
                        <Section>
                            <Row>
                                <Column className="px-20 text-right">
                                    <Link>Unsubscribe</Link>
                                </Column>
                                <Column className="text-left">
                                    <Link>Manage Preferences</Link>
                                </Column>
                            </Row>
                        </Section>
                        <Text className="mb-45 text-center text-gray-400">
                            6, Wilson Estate, Asore Town, Ajuwon, Ifo, Ogun State, Nigeria.
                            114302 <br /> &copy; {new Date().getFullYear()} WSH. All rights reserved.
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default ConfirmationEmail;
