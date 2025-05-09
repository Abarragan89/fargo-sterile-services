import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Rect,
    Svg,
    Font
} from '@react-pdf/renderer';
import path from 'path';
import { formatDate } from '../../../../utils/formatDate';
Font.register({
    family: 'cursiveFont',
    src: path.resolve('public', 'fonts', 'cursiveFont.ttf'),
});


// Define styles
const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 30,
        paddingVertical: 20,
        fontSize: 11,
        fontFamily: 'Helvetica',
        width: 612,
        height: 792
    },
    companyLogo: {
        width: 120,
    },
    section: {
        marginBottom: 2,
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
        fontSize: 11,
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
        marginVertical: 1,
        fontSize: 11
    },
    inputBox: {
        marginBottom: 10,
        border: '1 solid black',
        padding: 5,
    },
    signatureSection: {
        marginTop: 5,
        flexWrap: 'wrap',
        borderTop: '1px solid gray',
        paddingTop: 5,
        paddingHorizontal: 5,
        width: '100%'
    },
    smallText: {
        fontSize: 10,
        color: 'gray',
    },
});

// Define the PDF component
const NASUFpdf
    = ({ data }) => {
        return (
            <Document>
                <Page style={styles.page}>
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
                        <View style={styles.checkBoxLabel}>
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
                            {data?.facilityInformation?.accountType === 'update' && <Text style={styles.XMark}>X</Text>}
                            <Text style={{ marginLeft: 3 }}>Update</Text>
                        </View>
                        <Text style={styles.text}>Fagron Account Number: <Text style={styles.clientInfo}>{data?.facilityInformation?.accountNumber || ''}</Text></Text>
                    </View>

                    <View style={styles.section}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                            <Text style={styles.text}>Facility Name: <Text style={styles.clientInfo}>{data?.facilityInformation?.facilityName || ''}</Text></Text>
                            <Text style={styles.text}>Facility Phone Number: <Text style={styles.clientInfo}>{data?.facilityInformation?.phoneNumber || ''}</Text></Text>
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={styles.text}>Facility Type: <Text style={styles.clientInfo}>{data?.facilityInformation?.facilityType || ''}</Text></Text>
                            <Text style={[styles.text, { flex: 2, textAlign: 'right' }]}>Number of Beds: <Text style={styles.clientInfo}>{data?.facilityInformation?.numberOfBeds || ''}</Text></Text>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.text}>Facility Shipping Address: <Text style={{ fontSize: 11, color: 'gray' }}>(Submitted licenses must match shipping address)</Text></Text>
                        <View style={{ marginLeft: 10 }}>
                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.text}>Street Address: <Text style={styles.clientInfo}>{data?.facilityInformation?.street || ''}</Text></Text>
                                <Text style={styles.text}>Suite: <Text style={styles.clientInfo}>{data?.facilityInformation?.suite || 'N/A'}</Text></Text>
                                <Text style={styles.text}>Attn: <Text style={styles.clientInfo}>{data?.facilityInformation?.attn || 'N/A'}</Text></Text>
                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.text}>City: <Text style={styles.clientInfo}>{data?.facilityInformation?.city || ''}</Text></Text>
                                <Text style={styles.text}>State: <Text style={styles.clientInfo}>{data?.facilityInformation?.state || ''}</Text></Text>
                                <Text style={styles.text}>Zip Code: <Text style={styles.clientInfo}>{data?.facilityInformation?.zipCode || ''}</Text></Text>
                            </View>

                            <View style={[styles.section, { marginTop: 5 }]}>
                                <Text style={styles.bulletPoint}>
                                    • Shipping charges for expedited shipping will be applied to the order invoice.
                                </Text>
                                <Text style={styles.bulletPoint}>• Standard shipments are scheduled for delivery Monday - Friday.</Text>
                                <Text style={styles.bulletPoint}>• Refrigerated product is only shipped Monday-Wednesday.</Text>
                                <Text style={styles.bulletPoint}>
                                    • If alternative delivery schedule is required, please indicate details here:
                                </Text>
                                <View style={styles.inputBox}>
                                    <Text style={[styles.clientInfo, { textDecoration: 'none' }]}>{data?.facilityInformation?.alternativeSchedule || 'N/A'}</Text>
                                </View>
                                <Text style={styles.bulletPoint}>• All orders are shipped via UPS or FedEx.</Text>
                                <Text style={styles.bulletPoint}>
                                    • If shipping per customer&apos;s FedEx or UPS account is preferred, enter account number here:
                                </Text>
                                <View style={styles.inputBox}>
                                    <Text style={[styles.clientInfo, { textDecoration: 'none' }]}>{data?.facilityInformation?.fedExUpsNumber || 'N/A'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                        <Text style={styles.text}>Primary GPO Name: <Text style={styles.clientInfo}>{data?.facilityInformation?.primaryGPOName || ''}</Text></Text>
                        <Text style={[styles.text, { flex: 2, textAlign: 'right' }]}>IDN Group: <Text style={styles.clientInfo}>{data?.facilityInformation?.IDNGroup || 'N/A'}</Text></Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.heading}>Terms and Conditions</Text>
                        <Text style={styles.numberedPoints}>
                            1. Standard payment terms are Net 30 from invoice date.
                        </Text>
                        <Text style={styles.numberedPoints}>
                            2. $7500 credit limit upon completion of Fagron&apos;s credit application; additional information may be required
                            for higher limits. Completion of separate credit application is mandatory for account set up.
                        </Text>
                        <Text style={styles.numberedPoints}>
                            3. All orders are considered final when product has left the Seller&apos;s facility. No refunds or returns after shipment.
                        </Text>
                        <Text style={styles.numberedPoints}>
                            4. Customer agrees to immediately notify Seller of any change in ownership, form or business name of the entity.
                        </Text>
                        <Text style={styles.numberedPoints}>
                            5. This document will be as effective in photocopy or fax form as in the original.
                        </Text>
                        <Text style={styles.numberedPoints}>
                            6. Customer acknowledges and agrees that services may be provided by Fagron Sterile Services or an affiliate.
                        </Text>
                        <Text style={styles.numberedPoints}>
                            7. Customer acknowledges that Seller may limit or discontinue credit at its sole discretion and that the continued
                            extension of credit may require additional information.
                        </Text>
                        <Text style={styles.numberedPoints}>
                            8. Customer agrees that if any invoice is not paid when due, late charges will accrue at the rate of 1.5% per month
                            or the maximum rate allowed by law, whichever is less. If legal action is taken to pursue collection, jurisdiction
                            shall be the State of Texas and the venue shall be Travis County, Texas. The Customer agrees to reimburse
                            Seller for any attorney fees, court costs or other costs of collection which may be incurred in its efforts to
                            collect any past due debts.
                        </Text>
                        <Text style={styles.numberedPoints}>
                            9. In the event of an effective contract with terms that differ from the above, the effective contract will govern.
                        </Text>
                    </View>

                    <View style={styles.signatureSection}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.clientInfo, { paddingHorizontal: 10, fontSize: 11, textDecoration: 'none' }]}>{data?.termsAndConditionsInformation?.fullName || ''}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'hairline', width: 230, borderTop: '1px solid black' }}>Customer Name</Text>
                            </View>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.clientInfo, { paddingHorizontal: 10, fontSize: 11, textAlign: 'center', textDecoration: 'none' }]}>{data?.termsAndConditionsInformation?.jobTitle || ''}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'hairline', width: 230, borderTop: '1px solid black' }}>Job Title</Text>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 }}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.clientInfo, { paddingHorizontal: 10, fontSize: 11, fontFamily: 'cursiveFont', textDecoration: 'none' }]}>{data?.termsAndConditionsInformation?.fullName || ''}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'hairline', width: 230, borderTop: '1px solid black' }}>Signature</Text>
                            </View>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[styles.clientInfo, { paddingHorizontal: 10, fontSize: 11, textAlign: 'center', textDecoration: 'none' }]}>{formatDate(data?.termsAndConditionsInformation?.date) || ''}</Text>
                                <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'hairline', width: 230, borderTop: '1px solid black' }}>Date</Text>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        )
    };

export default NASUFpdf;
