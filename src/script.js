function setMarketingAnalyticsTag(analytics_code, view_code, client_name, smtpjs_token) {
    // set up google analytcs
    if (!window['ga']) {(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');}

    // set up email
    var Email = { send: function (a) { return new Promise(function (n, e) { a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) { n(e) }) }) }, ajaxPost: function (e, n, t) { var a = Email.createCORSRequest("POST", e); a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n) }, ajax: function (e, n) { var t = Email.createCORSRequest("GET", e); t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send() }, createCORSRequest: function (e, n) { var t = new XMLHttpRequest; return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t } };

    // constant params
    window['cns_param_options'] = {
        name: 'utm_campaign',
        source: 'utm_source',
        medium: 'utm_medium',
        id_unsubscribe: 'utm_idunsubscribe',
        campaign_unsubscribe: 'utm_campaignunsubscribe',
        email_unsubscribe: 'utm_emailunsubscribe'
    }

    // set up marketing methods
    // methods
    window['cns_analytics_get'] = function (url) {
        var hash;
        var obj = {};
        var hashes = url.slice(url.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            obj[hash[0]] = hash[1];
        }
        return obj;
    }

    window['cns_analytics_params'] = cns_analytics_get(window.location.search);

    window['cns_send_analytics'] = function (code, id) {
        ga('create', {
            trackingId: code,
            cookieDomain: 'auto',
            name: 'cns',
            userId: id
        });
        
        ga('cns.set', {
            anonymizeIp: true,
            referrer: window.location.host,
            dataSource: window.location.host,
            campaignName: cns_analytics_params[cns_param_options.name],
            campaignSource: cns_analytics_params[cns_param_options.source],
            campaignMedium: cns_analytics_params[cns_param_options.medium],
            campaignKeyword: (cns_analytics_params[cns_param_options.id_unsubscribe]) ? "ID:" + cns_analytics_params[cns_param_options.id_unsubscribe] + " CAMPAIGN:" + cns_analytics_params[cns_param_options.campaign_unsubscribe] + " EMAIL:" + cns_analytics_params[cns_param_options.email_unsubscribe] : undefined
        });
        ga('cns.send', 'pageview');

        if (cns_analytics_params[cns_param_options.id_unsubscribe]) {
            document.body.style.background = "#ffffff";
            document.querySelector('body').innerHTML = '<h1 style="text-align: center; color: #000">Please Confirm<br><button id="utm_agree_button">CONFIRM</button></h1>';
            document.querySelector('#utm_agree_button').addEventListener('click', function() {
                Email.send({
                    SecureToken : window['smtpjs_token'],
                    To : 'sophie.carter@marketingfilms.tv',
                    From : "unsubscribe@marketingfilms.tv",
                    Subject :  client_name + " - Unsubscribe",
                    Body : "ID: " + cns_analytics_params[cns_param_options.id_unsubscribe] + ", CAMPAIGN: " + cns_analytics_params[cns_param_options.campaign_unsubscribe] + ", EMAIL: " + cns_analytics_params[cns_param_options.email_unsubscribe]
                }).then(function(){
                    document.querySelector('body').innerHTML = '<h1 style="text-align: center; color: #000">Thank you</h1><p style="text-align: center; color: #000">You have been successfully removed from this subscriber list. You will no longer hear from us.</p>';
                });
            });
        }
    }

    cns_send_analytics(analytics_code, view_code);
}