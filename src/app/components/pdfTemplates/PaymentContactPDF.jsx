import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Rect,
    Svg,
} from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        fontSize: 12,
        fontFamily: 'Helvetica',
        width: 612,
        height: 792
    },
    companyLogo: {
        width: 120,
    },
    marginBottom: {
        marginBottom: 14,
    },
    marginTop: {
        marginTop: 10
    },
    checkBoxLabel: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    XMark: {
        position: 'absolute',
        top: -2,
        fontSize: 14,
        left: 1.5,
    },
    heading: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
    },
    marginY: {
        marginVertical: 5,
    },
    clientInfo: {
        fontFamily: 'Courier',
        fontSize: 12,
        textDecoration: 'underline',
    },
});

const paymentMethods = [
    { id: 'check', label: 'Check - Mail to: PO Box: Dept CH 18048, Palatine, IL 60055-8048' },
    { id: 'ach', label: 'ACH - Email remittance to: ar@fagronsterile.com' },
    { id: 'echeck', label: 'eCheck - Scan and email to: ar@fagronsterile.com' }
]
const contactTypes = [
    { id: 'business-contact', label: 'Business Contact' },
    { id: 'invoice-emails', label: 'Invoice Emails' },
    { id: 'order-confirmation-emails', label: 'Order Confirmation Emails' },
    { id: 'web-shop-access', label: 'Web Shop Access' },
    { id: 'ap-contact', label: 'A/P Contact' }
]

// Define the PDF component
const PaymentContactPDF = ({ data }) => {
    return (
        <Document>
            <Page style={styles.page}>
                <Image style={styles.companyLogo}
                    src="https://unfinished-pages.s3.us-east-2.amazonaws.com/companyLogo.png"
                />
                {/* Payment Section */}
                <View>
                    <Text style={[styles.heading, styles.marginY, styles.marginTop]}>Payment Method</Text>
                    {paymentMethods.map((option) => (
                        <View key={option.id} style={[styles.checkBoxLabel, styles.marginBottom]}>
                            <Svg
                                viewBox='0 0 5 5'
                                width={12}
                                height={12}>
                                <Rect
                                    width="5"
                                    height="5"
                                    strokeOpacity={1}
                                    stroke='black'
                                />
                            </Svg>
                            {data?.paymentMethod.paymentMethod === option.id && <Text style={styles.XMark}>X</Text>}
                            <Text style={{ marginLeft: 3 }}>{option.label}</Text>
                        </View>
                    ))}
                </View>
                {/*  Contact Section */}
                <Text style={[styles.heading, styles.marginY]}>Contact Information</Text>

                {data.contactInfo.map((contact, index) => (
                    <View key={index} style={{ borderTop: '1px solid gray', padding: '10 0', marginBottom: 5 }}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ marginBottom: 5 }}>Name: <Text style={styles.clientInfo}>{contact.name || ''}</Text></Text>
                            <Text style={{ marginBottom: 5 }}>Phone: <Text style={styles.clientInfo}>{contact.phone || 'N/A'}</Text></Text>
                        </View>
                        <Text style={{ marginBottom: 10 }}>Email: <Text style={styles.clientInfo}>{contact.email || ''}</Text></Text>

                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            {contactTypes.map((contactType, subIndex) => (
                                <View style={styles.checkBoxLabel} key={index.toString() + subIndex.toString()}>
                                    <Svg
                                        viewBox='0 0 5 5'
                                        width={12} // Adjusted to set the width of the icon
                                        height={12}>
                                        <Rect
                                            width="5"
                                            height="5"
                                            strokeOpacity={1}
                                            stroke='black'
                                        />
                                    </Svg>
                                    {contact?.type?.some(type => type.id === contactType.id) && <Text style={styles.XMark}>X</Text>}
                                    <Text style={{ marginLeft: 3, fontSize: 11 }}>{contactType.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </Page>
        </Document>
    )
};

export default PaymentContactPDF;
