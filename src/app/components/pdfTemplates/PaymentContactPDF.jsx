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
        paddingHorizontal: 30,
        paddingVertical: 20,
        fontSize: 12,
        fontFamily: 'Helvetica',
    },
    companyLogo: {
        width: 120,
    },
    section: {
        marginBottom: 3,
    },
    accountType: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid black',
        padding: 5
    },
    clientInfo: {
        fontFamily: 'Courier',
        fontSize: 12,
        textDecoration: 'underline',
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
        fontSize: 16,
        left: 1,
    },
    heading: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
    },
    text: {
        marginVertical: 5,
    },
    bulletPoint: {
        fontSize: 11.5,
        color: 'gray',
        marginVertical: 5
    },
    numberedPoints: {
        marginVertical: 3,
        fontSize: 11
    },
    inputBox: {
        marginBottom: 10,
        border: '1 solid black',
        padding: 5,
    },
    signatureSection: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        border: '1px solid gray',
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    signatureLine: {
        width: '40%',
        borderBottom: '1 solid black',
    },
    smallText: {
        fontSize: 10,
        color: 'gray',
    },
});

// Define the PDF component
const PaymentContactPDF = ({ data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Image style={styles.companyLogo}
                    src="https://unfinished-pages.s3.us-east-2.amazonaws.com/companyLogo.png"
                />
                <View style={[styles.section, styles.accountType]}>
                    <View style={styles.checkBoxLabel}>
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
                        {data?.facilityInformation?.accountType === 'new-account' && <Text style={styles.XMark}>X</Text>}
                        <Text style={{ marginLeft: 3 }}>New Account</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
};

export default PaymentContactPDF;
