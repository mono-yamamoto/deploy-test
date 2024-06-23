/*! konicaminolta | (c) MARS FLAG Corporation | www.marsflag.com | 2018-03-16 by An */
Array.prototype.indexOf || (Array.prototype.indexOf = function(e) {
    var r = this.length >>> 0,
        t = Number(arguments[1]) || 0;
    for ((t = t < 0 ? Math.ceil(t) : Math.floor(t)) < 0 && (t += r); t < r; t++)
        if (t in this && this[t] === e) return t;
    return -1;
}), (function(e) {
    var r = [];
    e.extend(!0, {
        import_js: function(t, a) {
            for (var o = !1, n = 0; n < r.length; n++)
                if (r[n] == t) {
                    o = !0;
                    break;
                }
            o || (e(a).append('<script type="text/javascript" src="' + t + '"><\/script>'), r.push(t));
        }
    });
})(jQuery), (function(e) {
    var r = [];
    e.extend(!0, {
        import_css: function(t, a) {
            for (var o = !1, n = 0; n < r.length; n++)
                if (r[n] == t) {
                    o = !0;
                    break;
                }
            o || (e(a).append('<link href="' + t + '" rel="stylesheet">'), r.push(t));
        }
    });
})(jQuery);
var setInitial = function(e) {
        var r = 'cn-zh-cn',
            t = '/mf2file/solutions/konicaminolta/static/live/',
            a = t + e + '/header.html',
            o = t + e + '/footer.html',
            n = (function(r, t, a) {
                var o = t;
                return e.indexOf('cn-zh-cn') > -1 && (o = t + '.cn'), o;
            //})(0, 'www.konicaminolta.com');
            })(0, 'wcms.konicaminolta.com:8145');	//<-- ここをテストサイトのドメインに変更　2018-03-30
        return {
            exception: r,
            domain: '/' + n,
            locationInfo: e,
            header: {
                ajaxUrl: a,
                anchor: '#header'
            },
            footer: {
                ajaxUrl: o,
                anchor: '#footer'
            },
            headerfooter: {
                ajaxUrl: '//' + n + '/shared/unchangeable/js/headerfooter.js',
                stylesheet: '//' + n + '/marsfinder/search.css',
                stylesheetLocal: '//' + n + '/' + e + '/shared/css/config.css'
            }
        };
    },
    mfCustom = setInitial(mf_lang);
mfCustom.setDomain = function(e, r) {
    var t = {
        domain: r.domain,
        deleteStr: ['<header role="banner" id="header">', '</header>"', '<footer role="contentinfo" class="footer" id="footer">', '</footer>'],
        filteredWord: ['href="/', 'src="/', 'value="/', 'base_uri: "/'],
        filteredHtml: ['', '', '', ''],
        lastHtml: ['', '', '', ''],
        spacer: '/',
        escapeRegExp: function(e) {
            return e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
        },
        replaceAll: function(e, r, a) {
            return e.replace(new RegExp(t.escapeRegExp(r), 'g'), a);
        }
    };
    t.filteredWordAfter = [t.filteredWord[0] + t.domain + t.spacer, t.filteredWord[1] + t.domain + t.spacer, t.filteredWord[2] + t.domain + t.spacer, t.filteredWord[3] + t.domain + t.spacer];
    for (var a = 0; a < t.filteredWord.length; a++) {
        var o = t.filteredWord[a],
            n = '',
            l = a - 1;
        n = 0 === a ? t.replaceAll(e, o, t.filteredWordAfter[a]) : t.replaceAll(t.filteredHtml[l], o, t.filteredWordAfter[a]), t.filteredHtml[a] = n;
    }
    for (a = 0; a < t.deleteStr.length; a++) o = t.deleteStr[a], n = '', l = a - 1, n = 0 === a ? t.replaceAll(t.filteredHtml[3], o, '') : t.replaceAll(t.lastHtml[l], o, ''), t.lastHtml[a] = n;
    return t.lastHtml[3];
}, mfCustom.setSearchHeader = function(e) {
    var r = $('#mf_h1'),
        t = $('#main main .l-header .l-header__block h1.l-header__block__ttl'),
        a = $('#main main .l-header .l-header__block .l-header__block__search'),
        o = $('#main main .l-header .l-header__block .l-header__block__sm-search-btn'),
        n = $('#mf_marsfinder'); - 1 === e.locationInfo.indexOf('ja') && -1 === e.locationInfo.indexOf('jp') && (a.remove(), o.remove(), n.attr('style', 'margin-top: 40px')), t.text(r.text()), t.show(), r.remove();
}, mfCustom.readyHandler = function(e, r) {
    var t, a = '/' + r + '/cn-zh-cn/alert.html',
        o = decodeURI(location.href),
        n = o.split('/'),
        l = e.length;
    if (l)
        for (var i = 0; i < l; i++) {
            var d = (t = e[i]).getAttribute('href'); - 1 === d.search(/alert.html/) && ('/' === d.charAt(0) && '/' !== d.charAt(1) && (d = n[0] + '//' + n[2] + d), t.setAttribute('href', a + '?exUrl_1=' + encodeURIComponent(d) + '&exUrl_2=' + encodeURIComponent(o)));
        }
}, mfCustom.initialFire = function(e) {
    mfCustom.setSearchHeader(e), $('#header .header').first().remove(), $('#dynamic-select').remove(), $.ajax({
        url: e.header.ajaxUrl
    }).done(function(r) {
        var t = e.setDomain(r, e);
        $(t).appendTo(e.header.anchor), $.ajax({
            url: e.footer.ajaxUrl
        }).done(function(r) {
            var t = e.setDomain(r, e);
            if ($(t).appendTo(e.footer.anchor), $.import_js(e.headerfooter.ajaxUrl, 'body'), $.import_css(e.headerfooter.stylesheetLocal, 'head'), e.exception.indexOf(e.locationInfo) > -1) {
                var a = document.getElementsByClassName('not-managed');
                mfCustom.readyHandler(a, e.domain);
            }
        });
    });
}, mfCustom.initialFire(mfCustom)