/**
 * Created by jj on 10/11/16.
 */

SSR.compileTemplate('htmlEmail', Assets.getText('emailTemplates/html-email.html'));
SSR.compileTemplate('verificationEmail', Assets.getText('emailTemplates/signup-verification-email.html'));
SSR.compileTemplate('resetPassword', Assets.getText('emailTemplates/reset-password-email.html'));
SSR.compileTemplate('giftcardEmail', Assets.getText('emailTemplates/reset-password-email.html'));

// Note: These are GLOBAL CHANGES!!!
Accounts.emailTemplates.siteName = "CarpStreet";


Accounts.emailTemplates.verifyEmail =
{
    subject()
    {
        return "Please verify your email address.";
    },

    from()
    {
        return "Jenny from CarpStreet <team@carpstreet.com>";
    },

    html( user, url)    // url is the confirmation URL
    {
        let emailData = {
            urlWithoutHash : url.replace( '#/', '' ),
            supportEmail   : "team@carpstreet.com"
        };

        return SSR.render('verificationEmail', emailData);
    }
};


Accounts.emailTemplates.resetPassword =
{
    subject()
    {
        return "Link to reset your password.";
    },

    from()
    {
        return "Jenny from CarpStreet <team@carpstreet.com>";
    },

    html( user, url)    // url is the confirmation URL
    {
        let emailData = {
            emailAddress   : user.emails[0].address,
            urlWithoutHash : url.replace( '#/', '' ),
            supportEmail   : "team@carpstreet.com"
        };

        return SSR.render('resetPassword', emailData);
    }
};


Meteor.methods
({
    sendVerificationEmails()
    {
        let userId = Meteor.userId();

        if (userId)
        {
            const unVerifiedEmails = Meteor.user().emails.filter(email => !email.verified).map(email => email.address);

            // grab all unverified email addresses
            unVerifiedEmails.forEach( address => Accounts.sendVerificationEmail( userId,  address) );

            return unVerifiedEmails;
        }
        else
        {
            throw new Meteor.Error('not logged in', 'Please login first');
        }
    },

    sendResetPasswordEmail(email)
    {
        const user = Accounts.findUserByEmail(email);

        if (user) Accounts.sendResetPasswordEmail(user._id);
    },

    testEmail()
    {
        var emailData = {
            name: "Dheera Funn",
            favoriteRestaurant: "Noodles",
            bestFriend: "dude"
        };

        Email.send({
            to: "beautyofdeduction@gmail.com",
            from: "jj@carpstreet.com",
            subject: "Test Email from Meteor via Mailgun",
            html: SSR.render('htmlEmail', emailData),
            attachments:
                [
                    {
                        fileName: 'flapjacks.pdf',
                        filePath: 'https://s3.amazonaws.com/tmc-post-content/flapjacks.pdf',
                        contentType: 'pdf',
                    },
                    {
                        fileName: 'duck.jpg',
                        filePath: 'https://img.buzzfeed.com/buzzfeed-static/static/enhanced/webdr01/2013/5/29/10/enhanced-buzz-18742-1369837724-0.jpg',
                        contentType: 'jpg'
                    }
                ]
        });
    },

    sendGiftcardEmail(email, amount, cardNumber)
    {
        const emailData = {
            amount: amount,
            cardNumber: cardNumber
        };

        Email.send({
            to: email,
            from: "jj@carpstreet.com",
            subject: "Thank you for updating your availabilities. Here is your gift card.",
            html: SSR.render('giftcardEmail', emailData)
        });
    }
});