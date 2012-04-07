(function () {
    var lang = {
            months : "Gener_Febrer_Març_Abril_Maig_Juny_Juliol_Agost_Setembre_Octubre_Novembre_Desembre".split("_"),
            monthsShort : "Gen._Febr._Mar._Abr._Mai._Jun._Jul._Ag._Set._Oct._Nov._Des.".split("_"),
            weekdays : "Diumenge_Dilluns_Dimarts_Dimecres_Dijous_Divendres_Dissabte".split("_"),
            weekdaysShort : "Dg._Dl._Dt._Dc._Dj._Dv._Ds.".split("_"),
            longDateFormat : {
                LT : "H:mm",
                L : "DD/MM/YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd D MMMM YYYY LT"
            },
            calendar : {
                sameDay : function () {
                    return '[avui a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                nextDay : function () {
                    return '[demà a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                nextWeek : function () {
                    return 'dddd [a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                lastDay : function () {
                    return '[ahir a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                lastWeek : function () {
                    return '[el] dddd [passat a ' + ((this.hours() !== 1) ? 'les' : 'la') + '] LT';
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : "en %s",
                past : "fa %s",
                s : "uns segons",
                m : "un minut",
                mm : "%d minuts",
                h : "una hora",
                hh : "%d hores",
                d : "un dia",
                dd : "%d dies",
                M : "un mes",
                MM : "%d mesos",
                y : "un any",
                yy : "%d anys"
            },
            ordinal : function (number) {
                return 'º';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('ca', lang);
    }
}());
(function () {
    var lang = {
            months : "Januar_Februar_Marts_April_Maj_Juni_Juli_August_September_Oktober_November_December".split("_"),
            monthsShort : "Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aug_Sep_Okt_Nov_Dec".split("_"),
            weekdays : "Søndag_Mandag_Tirsdag_Onsdag_Torsdag_Fredag_Lørdag".split("_"),
            weekdaysShort : "Søn_Man_Tir_Ons_Tor_Fre_Lør".split("_"),
            longDateFormat : {
                LT : "h:mm A",
                L : "DD/MM/YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY h:mm A",
                LLLL : "dddd D. MMMM, YYYY h:mm A"
            },
            calendar : {
                sameDay : '[I dag kl.] LT',
                nextDay : '[I morgen kl.] LT',
                nextWeek : 'dddd [kl.] LT',
                lastDay : '[I går kl.] LT',
                lastWeek : '[sidste] dddd [kl] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : "om %s",
                past : "%s siden",
                s : "få sekunder",
                m : "minut",
                mm : "%d minutter",
                h : "time",
                hh : "%d timer",
                d : "dag",
                dd : "%d dage",
                M : "månede",
                MM : "%d måneder",
                y : "år",
                yy : "%d år"
            },
            ordinal : function (number) {
                    return '.';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('da', lang);
    }
}());
(function () {
    var lang = {
            months : "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
            monthsShort : "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
            weekdays : "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
            weekdaysShort : "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
            longDateFormat : {
                LT: "H:mm U\\hr",
                L : "DD.MM.YYYY",
                LL : "D. MMMM YYYY",
                LLL : "D. MMMM YYYY LT",
                LLLL : "dddd, D. MMMM YYYY LT"
            },
            calendar : {
                sameDay: "[Heute um] LT",
                sameElse: "L",
                nextDay: '[Morgen um] LT',
                nextWeek: 'dddd [um] LT',
                lastDay: '[Gestern um] LT',
                lastWeek: '[letzten] dddd [um] LT'
            },
            relativeTime : {
                future : "in %s",
                past : "vor %s",
                s : "ein paar Sekunden",
                m : "einer Minute",
                mm : "%d Minuten",
                h : "einer Stunde",
                hh : "%d Stunden",
                d : "einem Tag",
                dd : "%d Tagen",
                M : "einem Monat",
                MM : "%d Monaten",
                y : "einem Jahr",
                yy : "%d Jahren"
            },
            ordinal : function (number) {
                return '.';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('de', lang);
    }
}());
(function () {
    var lang = {
            months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
            monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
            weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
            weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
            longDateFormat : {
                LT : "h:mm A",
                L : "DD/MM/YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd, D MMMM YYYY LT"
            },
            calendar : {
                sameDay : '[Today at] LT',
                nextDay : '[Tomorrow at] LT',
                nextWeek : 'dddd [at] LT', 
                lastDay : '[Yesterday at] LT',
                lastWeek : '[last] dddd [at] LT', 
                sameElse : 'L'
            },
            relativeTime : {
                future : "in %s",
                past : "%s ago",
                s : "a few seconds",
                m : "a minute",
                mm : "%d minutes",
                h : "an hour",
                hh : "%d hours",
                d : "a day",
                dd : "%d days",
                M : "a month",
                MM : "%d months",
                y : "a year",
                yy : "%d years"
            },
            ordinal : function (number) {
                var b = number % 10;
                return (~~ (number % 100 / 10) === 1) ? 'th' :
                    (b === 1) ? 'st' :
                    (b === 2) ? 'nd' :
                    (b === 3) ? 'rd' : 'th';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('en-gb', lang);
    }
}());
(function () {
    var lang = {
            months : "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split("_"),
            monthsShort : "Ene._Feb._Mar._Abr._May._Jun._Jul._Ago._Sep._Oct._Nov._Dic.".split("_"),
            weekdays : "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
            weekdaysShort : "Dom._Lun._Mar._Mié._Jue._Vie._Sáb.".split("_"),
            longDateFormat : {
                LT : "H:mm",
                L : "DD/MM/YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd D MMMM YYYY LT"
            },
            calendar : {
                sameDay : function () {
                    return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                nextDay : function () {
                    return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                nextWeek : function () {
                    return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                lastDay : function () {
                    return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                lastWeek : function () {
                    return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : "en %s",
                past : "hace %s",
                s : "unos segundos",
                m : "un minuto",
                mm : "%d minutos",
                h : "una hora",
                hh : "%d horas",
                d : "un día",
                dd : "%d días",
                M : "un mes",
                MM : "%d meses",
                y : "un año",
                yy : "%d años"
            },
            ordinal : function (number) {
                return 'º';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('es', lang);
    }
}());
(function () {
    var lang = {
            months : "urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua".split("_"),
            monthsShort : "urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.".split("_"),
            weekdays : "igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata".split("_"),
            weekdaysShort : "ig._al._ar._az._og._ol._lr.".split("_"),
            longDateFormat : {
                LT : "HH:mm",
                L : "YYYY-MM-DD",
                LL : "YYYYko MMMMren D[a]",
                LLL : "YYYYko MMMMren D[a] LT",
                LLLL : "dddd, YYYYko MMMMren D[a] LT"
            },
            calendar : {
                sameDay : '[gaur] LT[etan]',
                nextDay : '[bihar] LT[etan]',
                nextWeek : 'dddd LT[etan]',
                lastDay : '[atzo] LT[etan]',
                lastWeek : '[aurreko] dddd LT[etan]',
                sameElse : 'L'
            },
            relativeTime : {
                future : "%s barru",
                past : "duela %s",
                s : "segundo batzuk",
                m : "minutu bat",
                mm : "%d minutu",
                h : "ordu bat",
                hh : "%d ordu",
                d : "egun bat",
                dd : "%d egun",
                M : "hilabete bat",
                MM : "%d hilabete",
                y : "urte bat",
                yy : "%d urte"
            },
            ordinal : function (number) {
                return '.';
            }
        };
    
    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('eu', lang);
    }
}());
(function () {
    var numbers_past = ['nolla', 'yksi', 'kaksi', 'kolme', 'neljä', 'viisi',
                        'kuusi', 'seitsemän', 'kahdeksan', 'yhdeksän'];
    var numbers_future = ['nolla', 'yhden', 'kahden', 'kolmen', 'neljän', 'viiden',
                          'kuuden', numbers_past[7], numbers_past[8], numbers_past[9]];

    function translate(number, withoutSuffix, key, isFuture) {
        var result = "";
        switch (key) {
        case 's':
            return isFuture ? 'muutaman sekunnin' : 'muutama sekunti';
        case 'm':
            return isFuture ? 'minuutin' : 'minuutti';
        case 'mm':
            result = isFuture ? 'minuutin' : 'minuuttia';
            break;
        case 'h':
            return isFuture ? 'tunnin' : 'tunti';
        case 'hh':
            result = isFuture ? 'tunnin' : 'tuntia';
            break;
        case 'd':
            return isFuture ? 'päivän' : 'päivä';
        case 'dd':
            result = isFuture ? 'päivän' : 'päivää';
            break;
        case 'M':
            return isFuture ? 'kuukauden' : 'kuukausi';
        case 'MM':
            result = isFuture ? 'kuukauden' : 'kuukautta';
            break;
        case 'y':
            return isFuture ? 'vuoden' : 'vuosi';
        case 'yy':
            result = isFuture ? 'vuoden' : 'vuotta';
            break;
        }
        result = verbal_number(number, isFuture) + " " + result;
        return result;
    }

    function verbal_number(number, isFuture) {
        return number < 10 ? (isFuture ? numbers_future[number] : numbers_past[number]) : number;
    }

    var lang = {
            months : "tammikuu_helmikuu_maaliskuu_huhtikuu_toukokuu_kesäkuu_heinäkuu_elokuu_syyskuu_lokakuu_marraskuu_joulukuu".split("_"),
            monthsShort : "tam_hel_maa_huh_tou_kes_hei_elo_syy_lok_mar_jou".split("_"),
            weekdays : "sunnuntai_maanantai_tiistai_keskiviikko_torstai_perjantai_lauantai".split("_"),
            weekdaysShort : "su_ma_ti_ke_to_pe_la".split("_"),
            longDateFormat : {
                LT : "HH.mm",
                L : "DD.MM.YYYY",
                LL : "Do MMMMt\\a YYYY",
                LLL : "Do MMMMt\\a YYYY, klo LT",
                LLLL : "dddd, Do MMMMt\\a YYYY, klo LT"
            },
            calendar : {
                sameDay : '[tänään] [klo] LT',
                nextDay : '[huomenna] [klo] LT',
                nextWeek : 'dddd [klo] LT',
                lastDay : '[eilen] [klo] LT',
                lastWeek : '[viime] dddd[na] [klo] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : "%s päästä",
                past : "%s sitten",
                s : translate,
                m : translate,
                mm : translate,
                h : translate,
                hh : translate,
                d : translate,
                dd : translate,
                M : translate,
                MM : translate,
                y : translate,
                yy : translate
            },
            ordinal : function (number) {
                return ".";
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('fi', lang);
    }
}());(function () {
    var lang = {
            months : "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
            monthsShort : "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
            weekdays : "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
            weekdaysShort : "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
            longDateFormat : {
                LT : "HH:mm",
                L : "DD/MM/YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd D MMMM YYYY LT"
            },
            calendar : {
                sameDay: "[Aujourd'hui à] LT",
                nextDay: '[Demain à] LT',
                nextWeek: 'dddd [à] LT',
                lastDay: '[Hier à] LT',
                lastWeek: 'dddd [dernier à] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : "dans %s",
                past : "il y a %s",
                s : "quelques secondes",
                m : "une minute",
                mm : "%d minutes",
                h : "une heure",
                hh : "%d heures",
                d : "un jour",
                dd : "%d jours",
                M : "un mois",
                MM : "%d mois",
                y : "une année",
                yy : "%d années"
            },
            ordinal : function (number) {
                return number === 1 ? 'er' : 'ème';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('fr', lang);
    }
}());
(function () {
    var lang = {
            months : "Xaneiro_Febreiro_Marzo_Abril_Maio_Xuño_Xullo_Agosto_Setembro_Octubro_Novembro_Decembro".split("_"),
            monthsShort : "Xan._Feb._Mar._Abr._Mai._Xuñ._Xul._Ago._Set._Out._Nov._Dec.".split("_"),
            weekdays : "Domingo_Luns_Martes_Mércores_Xoves_Venres_Sábado".split("_"),
            weekdaysShort : "Dom._Lun._Mar._Mér._Xov._Ven._Sáb.".split("_"),
            longDateFormat : {
                LT : "H:mm",
                L : "DD/MM/YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd D MMMM YYYY LT"
            },
            calendar : {
                sameDay : function () {
                    return '[hoxe ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
                },
                nextDay : function () {
                    return '[mañá ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
                },
                nextWeek : function () {
                    return 'dddd [' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
                },
                lastDay : function () {
                    return '[onte ' + ((this.hours() !== 1) ? 'á' : 'a') + '] LT';
                },
                lastWeek : function () {
                    return '[o] dddd [pasado ' + ((this.hours() !== 1) ? 'ás' : 'a') + '] LT';
                },
                sameElse : 'L'
            },
            relativeTime : {
                future : "en %s",
                past : "fai %s",
                s : "uns segundo",
                m : "un minuto",
                mm : "%d minutos",
                h : "unha hora",
                hh : "%d horas",
                d : "un día",
                dd : "%d días",
                M : "un mes",
                MM : "%d meses",
                y : "un ano",
                yy : "%d anos"
            },
            ordinal : function (number) {
                return 'º';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('gl', lang);
    }
}());
(function () {
    var lang = {
            months : "Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settebre_Ottobre_Novembre_Dicembre".split("_"),
            monthsShort : "Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic".split("_"),
            weekdays : "Domenica_Lunedi_Martedi_Mercoledi_Giovedi_Venerdi_Sabato".split("_"),
            weekdaysShort : "Dom_Lun_Mar_Mer_Gio_Ven_Sab".split("_"),
            longDateFormat : { 
                LT : "HH:mm",
                L : "DD/MM/YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd, D MMMM YYYY LT"
            },
            calendar : {
                sameDay: '[Oggi alle] LT',
                nextDay: '[Domani alle] LT',
                nextWeek: 'dddd [alle] LT',
                lastDay: '[Ieri alle] LT',
                lastWeek: '[lo scorso] dddd [alle] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : "in %s",
                past : "%s fa",
                s : "secondi",
                m : "un minuto",
                mm : "%d minuti",
                h : "un ora",
                hh : "%d ore",
                d : "un giorno",
                dd : "%d giorni",
                M : "un mese",
                MM : "%d mesi",
                y : "un anno",
                yy : "%d anni"
            },
            ordinal: function () {
                return 'º';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('it', lang);
    }
}());
(function () {
    var lang = {
            months : "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            monthsShort : "1월_2월_3월_4월_5월_6월_7월_8월_9월_10월_11월_12월".split("_"),
            weekdays : "일요일_월요일_화요일_수요일_목요일_금요일_토요일".split("_"),
            weekdaysShort : "일_월_화_수_목_금_토".split("_"),
            longDateFormat : {
                LT : "A h시 mm분",
                L : "YYYY.MM.DD",
                LL : "YYYY년 MMMM D일",
                LLL : "YYYY년 MMMM D일 LT",
                LLLL : "YYYY년 MMMM D일 dddd LT"
            },
            meridiem : function(hour, minute, isUpper) {
                return hour < 12 ? '오전' : '오후';
            },
            calendar : {
                sameDay : '오늘 LT',
                nextDay : '내일 LT',
                nextWeek : 'dddd LT',
                lastDay : '어제 LT',
                lastWeek : '지난주 dddd LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : "%s 후",
                past : "%s 전",
                s : "몇초",
                ss : "%d초",
                m : "일분",
                mm : "%d분",
                h : "한시간",
                hh : "%d시간",
                d : "하루",
                dd : "%d일",
                M : "한달",
                MM : "%d달",
                y : "일년",
                yy : "%d년"
            },
            ordinal : function (number) {
                return '일';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('kr', lang);
    }
}());
(function () {
    var lang = {
            months : "januar_februar_mars_april_mai_juni_juli_august_september_oktober_november_desember".split("_"),
            monthsShort : "jan_feb_mar_apr_mai_jun_jul_aug_sep_okt_nov_des".split("_"),
            weekdays : "søndag_mandag_tirsdag_onsdag_torsdag_fredag_lørdag".split("_"),
            weekdaysShort : "søn_man_tir_ons_tor_fre_lør".split("_"),
            longDateFormat : {
                LT : "HH:mm",
                L : "YYYY-MM-DD",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd D MMMM YYYY LT"
            },
            calendar : {
                sameDay: '[I dag klokken] LT',
                nextDay: '[I morgen klokken] LT',
                nextWeek: 'dddd [klokken] LT',
                lastDay: '[I går klokken] LT',
                lastWeek: '[Forrige] dddd [klokken] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : "om %s",
                past : "for %s siden",
                s : "noen sekunder",
                m : "ett minutt",
                mm : "%d minutter",
                h : "en time",
                hh : "%d timer",
                d : "en dag",
                dd : "%d dager",
                M : "en måned",
                MM : "%d måneder",
                y : "ett år",
                yy : "%d år"
            },
            ordinal : function (number) {
                return '.';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('nb', lang);
    }
}());
(function () {
    var lang = {
            months : "januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december".split("_"),
            monthsShort : "jan._feb._mar._apr._mei._jun._jul._aug._sep._okt._nov._dec.".split("_"),
            weekdays : "zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag".split("_"),
            weekdaysShort : "zo._ma._di._wo._do._vr._za.".split("_"),
            longDateFormat : { 
                LT : "HH:mm",
                L : "DD-MM-YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd D MMMM YYYY LT"
            },
            calendar : {
                sameDay: '[Vandaag om] LT',
                nextDay: '[Morgen om] LT',
                nextWeek: 'dddd [om] LT',
                lastDay: '[Gisteren om] LT',
                lastWeek: '[afgelopen] dddd [om] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : "over %s",
                past : "%s geleden",
                s : "een paar seconden",
                m : "één minuut",
                mm : "%d minuten",
                h : "één uur",
                hh : "%d uur",
                d : "één dag",
                dd : "%d dagen",
                M : "één maand",
                MM : "%d maanden",
                y : "één jaar",
                yy : "%d jaar"
            },
            ordinal : function (number) {
                return (number === 1 || number === 8 || number >= 20) ? 'ste' : 'de';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('nl', lang);
    }
}());
(function () {
    var plural = function (n) { 
        return (n % 10 < 5) && (n % 10 > 1) && (~~(n / 10) !== 1);
    },
    
    translate = function (number, withoutSuffix, key) {
        var result = number + " ";
        switch (key) {
        case 'm': 
            return withoutSuffix ? 'minuta' : 'minutę';
        case 'mm': 
            return result + (plural(number) ? 'minuty' : 'minut');
        case 'h': 
            return withoutSuffix  ? 'godzina'  : 'godzinę';
        case 'hh': 
            return result + (plural(number) ? 'godziny' : 'godzin');
        case 'MM': 
            return result + (plural(number) ? 'miesiące' : 'miesięcy');
        case 'yy': 
            return result + (plural(number) ? 'lata' : 'lat');
        }
    },
  
    lang = {
        months : "styczeń_luty_marzec_kwiecień_maj_czerwiec_lipiec_sierpień_wrzesień_październik_listopad_grudzień".split("_"),
        monthsShort : "sty_lut_mar_kwi_maj_cze_lip_sie_wrz_paź_lis_gru".split("_"),
        weekdays : "niedziela_poniedziałek_wtorek_środa_czwartek_piątek_sobota".split("_"),
        weekdaysShort : "nie_pon_wt_śr_czw_pt_sb".split("_"),
        longDateFormat : {
            LT : "HH:mm",
            L : "DD-MM-YYYY",
            LL : "D MMMM YYYY",
            LLL : "D MMMM YYYY LT",
            LLLL : "dddd, D MMMM YYYY LT"
        },
        calendar : {
            sameDay: '[Dziś o] LT',
            nextDay: '[Jutro o] LT',
            nextWeek: '[W] dddd [o] LT',
            lastDay: '[Wczoraj o] LT',
            lastWeek: '[W zeszły/łą] dddd [o] LT',
            sameElse: 'L'
        },
        relativeTime : {
            future : "za %s",
            past : "%s temu",
            s : "kilka sekund",
            m : translate,
            mm : translate,
            h : translate,
            hh : translate,
            d : "1 dzień",
            dd : '%d dni',
            M : "miesiąc",
            MM : translate,
            y : "rok",
            yy : translate
        },
        ordinal : function (number) {
            return '.';
        }
    };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('pl', lang);
    }
}());
(function () {
    var lang = {
            months : "Janeiro_Fevereiro_Março_Abril_Maio_Junho_Julho_Agosto_Setembro_Outubro_Novembro_Dezembro".split("_"),
            monthsShort : "Jan_Fev_Mar_Abr_Mai_Jun_Jul_Ago_Set_Out_Nov_Dez".split("_"),
            weekdays : "Domingo_Segunda-feira_Terça-feira_Quarta-feira_Quinta-feira_Sexta-feira_Sábado".split("_"),
            weekdaysShort : "Dom_Seg_Ter_Qua_Qui_Sex_Sáb".split("_"),
            longDateFormat : { 
                LT : "HH:mm",
                L : "DD/MM/YYYY",
                LL : "D \\de MMMM \\de YYYY",
                LLL : "D \\de MMMM \\de YYYY LT",
                LLLL : "dddd, D \\de MMMM \\de YYYY LT"
            },
            calendar : {
                sameDay: '[Hoje às] LT',
                nextDay: '[Amanhã às] LT',
                nextWeek: 'dddd [às] LT',
                lastDay: '[Ontem às] LT',
                lastWeek: function () {
                    return (this.day() === 0 || this.day() === 6) ? 
                        '[Último] dddd [às] LT' : // Saturday + Sunday
                        '[Última] dddd [às] LT'; // Monday - Friday
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : "em %s",
                past : "%s atrás",
                s : "segundos",
                m : "um minuto",
                mm : "%d minutos",
                h : "uma hora",
                hh : "%d horas",
                d : "um dia",
                dd : "%d dias",
                M : "um mês",
                MM : "%d meses",
                y : "um ano",
                yy : "%d anos"
            },
            ordinal : function (number) {
                return 'º';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('pt', lang);
    }
}());
(function () {

    var pluralRules = [
        function (n) { return ((n % 10 === 1) && (n % 100 !== 11)); },
        function (n) { return ((n % 10) >= 2 && (n % 10) <= 4 && ((n % 10) % 1) === 0) && ((n % 100) < 12 || (n % 100) > 14); },
        function (n) { return ((n % 10) === 0 || ((n % 10) >= 5 && (n % 10) <= 9 && ((n % 10) % 1) === 0) || ((n % 100) >= 11 && (n % 100) <= 14 && ((n % 100) % 1) === 0)); },
        function (n) { return true; }
    ],

    plural = function (word, num) {
        var forms = word.split('_'),
        minCount = Math.min(pluralRules.length, forms.length),
        i = -1;

        while (++i < minCount) {
            if (pluralRules[i](num)) {
                return forms[i];
            }
        }
        return forms[minCount - 1];
    },

    relativeTimeWithPlural = function (number, withoutSuffix, key) {
        var format = {
            'mm': 'минута_минуты_минут_минуты',
            'hh': 'час_часа_часов_часа',
            'dd': 'день_дня_дней_дня',
            'MM': 'месяц_месяца_месяцев_месяца',
            'yy': 'год_года_лет_года'
        };
        if (key === 'm') {
            return withoutSuffix ? 'минута' : 'минуту';
        }
        else {
            return number + ' ' + plural(format[key], +number);
        }
    },

    lang = {
            months : "январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь".split("_"),
            monthsShort : "янв_фев_мар_апр_май_июн_июл_авг_сен_окт_ноя_дек".split("_"),
            weekdays : "воскресенье_понедельник_вторник_среда_четверг_пятница_суббота".split("_"),
            weekdaysShort : "вск_пнд_втр_срд_чтв_птн_суб".split("_"),
            longDateFormat : {
                LT : "HH:mm",
                L : "DD-MM-YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd, D MMMM YYYY LT"
            },
            calendar : {
                sameDay: '[Сегодня в] LT',
                nextDay: '[Завтра в] LT',
                lastDay: '[Вчера в] LT',
                nextWeek: function () {
                    return this.day() === 2 ? '[Во] dddd [в] LT' : '[В] dddd [в] LT';
                },
                lastWeek: function () {
                    switch (this.day()) {
                    case 0:
                        return '[В прошлое] dddd [в] LT';
                    case 1:
                    case 2:
                    case 4:
                        return '[В прошлый] dddd [в] LT';
                    case 3:
                    case 5:
                    case 6:
                        return '[В прошлую] dddd [в] LT';
                    }
                },
                sameElse: 'L'
            },
            // It needs checking (adding) russian plurals and cases.
            relativeTime : {
                future : "через %s",
                past : "%s назад",
                s : "несколько секунд",
                m : relativeTimeWithPlural,
                mm : relativeTimeWithPlural,
                h : "час",
                hh : relativeTimeWithPlural,
                d : "день",
                dd : relativeTimeWithPlural,
                M : "месяц",
                MM : relativeTimeWithPlural,
                y : "год",
                yy : relativeTimeWithPlural
            },
            ordinal : function (number) {
                return '.';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('ru', lang);
    }
}());
(function () {
    var lang = {
            months : "januari_februari_mars_april_maj_juni_juli_augusti_september_oktober_november_december".split("_"),
            monthsShort : "jan_feb_mar_apr_maj_jun_jul_aug_sep_okt_nov_dec".split("_"),
            weekdays : "söndag_måndag_tisdag_onsdag_torsdag_fredag_lördag".split("_"),
            weekdaysShort : "sön_mån_tis_ons_tor_fre_lör".split("_"),
            longDateFormat : {
                LT : "HH:mm",
                L : "YYYY-MM-DD",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd D MMMM YYYY LT"
            },
            calendar : {
                sameDay: '[Idag klockan] LT',
                nextDay: '[Imorgon klockan] LT',
                lastDay: '[Igår klockan] LT',
                nextWeek: 'dddd [klockan] LT',
                lastWeek: '[Förra] dddd [en klockan] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : "om %s",
                past : "för %s sen",
                s : "några sekunder",
                m : "en minut",
                mm : "%d minuter",
                h : "en timme",
                hh : "%d timmar",
                d : "en dag",
                dd : "%d dagar",
                M : "en månad",
                MM : "%d månader",
                y : "ett år",
                yy : "%d år"
            },
            ordinal : function (number) {
                var b = number % 10;
                return (~~ (number % 100 / 10) === 1) ? 'e' :
                    (b === 1) ? 'a' :
                    (b === 2) ? 'a' :
                    (b === 3) ? 'e' : 'e';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('sv', lang);
    }
}());
(function () {
    var lang = {
            months : "Ocak_Şubat_Mart_Nisan_Mayıs_Haziran_Temmuz_Ağustos_Eylül_Ekim_Kasım_Aralık".split("_"),
            monthsShort : "Oca_Şub_Mar_Nis_May_Haz_Tem_Ağu_Eyl_Eki_Kas_Ara".split("_"),
            weekdays : "Pazar_Pazartesi_Salı_Çarşamba_Perşembe_Cuma_Cumartesi".split("_"),
            weekdaysShort : "Paz_Pts_Sal_Çar_Per_Cum_Cts".split("_"),
            longDateFormat : {
                LT : "HH:mm",
                L : "DD.MM.YYYY",
                LL : "D MMMM YYYY",
                LLL : "D MMMM YYYY LT",
                LLLL : "dddd, D MMMM YYYY LT"
            },
            calendar : {
                sameDay : '[bugün saat] LT',
                nextDay : '[yarın saat] LT',
                nextWeek : '[haftaya] dddd [saat] LT', 
                lastDay : '[dün] LT',
                lastWeek : '[geçen hafta] dddd [saat] LT', 
                sameElse : 'L'
            },
            relativeTime : {
                future : "%s sonra",
                past : "%s önce",
                s : "birkaç saniye",
                m : "bir dakika",
                mm : "%d dakika",
                h : "bir saat",
                hh : "%d saat",
                d : "bir gün",
                dd : "%d gün",
                M : "bir ay",
                MM : "%d ay",
                y : "bir yıl",
                yy : "%d yıl"
            },
            ordinal : function (number) {
                var b = number % 10;
                return (~~ (number % 100 / 10) === 1) ? 'th' :
                    (b === 1) ? 'st' :
                    (b === 2) ? 'nd' :
                    (b === 3) ? 'rd' : 'th';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('tr', lang);
    }
}());
(function () {
    var lang = {
            months : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            weekdays : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort : "周日_周一_周二_周三_周四_周五_周六".split("_"),
            longDateFormat : {
                LT : "Ah点mm",
                L : "YYYY年MMMMD日",
                LL : "YYYY年MMMMD日",
                LLL : "YYYY年MMMMD日LT",
                LLLL : "YYYY年MMMMD日ddddLT"
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 9) {
                    return "早上";
                } else if (hour < 11 && minute < 30) {
                    return "上午";
                } else if (hour < 13 && minute < 30) {
                    return "中午";
                } else if (hour < 18) {
                    return "下午";
                } else {
                    return "晚上";
                }
            },
            calendar : {
                sameDay : '[今天]LT',
                nextDay : '[明天]LT',
                nextWeek : '[下]ddddLT', 
                lastDay : '[昨天]LT',
                lastWeek : '[上]ddddLT', 
                sameElse : 'L'
            },
            relativeTime : {
                future : "%s后",
                past : "%s前",
                s : "几秒",
                m : "1分钟",
                mm : "%d分钟",
                h : "1小时",
                hh : "%d小时",
                d : "1天",
                dd : "%d天",
                M : "1个月",
                MM : "%d个月",
                y : "1年",
                yy : "%d年"
            },
            ordinal : function (number) {
                    return '';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('zh-cn', lang);
    }
}());
(function () {
    var lang = {
            months : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            monthsShort : "一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月".split("_"),
            weekdays : "星期日_星期一_星期二_星期三_星期四_星期五_星期六".split("_"),
            weekdaysShort : "週日_週一_週二_週三_週四_週五_週六".split("_"),
            longDateFormat : {
                LT : "Ah點mm",
                L : "YYYY年MMMMD日",
                LL : "YYYY年MMMMD日",
                LLL : "YYYY年MMMMD日LT",
                LLLL : "YYYY年MMMMD日ddddLT"
            },
            meridiem : function (hour, minute, isLower) {
                if (hour < 9) {
                    return "早上";
                } else if (hour < 11 && minute < 30) {
                    return "上午";
                } else if (hour < 13 && minute < 30) {
                    return "中午";
                } else if (hour < 18) {
                    return "下午";
                } else {
                    return "晚上";
                }
            },
            calendar : {
                sameDay : '[今天]LT',
                nextDay : '[明天]LT',
                nextWeek : '[下]ddddLT',
                lastDay : '[昨天]LT',
                lastWeek : '[上]ddddLT',
                sameElse : 'L'
            },
            relativeTime : {
                future : "%s後",
                past : "%s前",
                s : "幾秒",
                m : "一分鐘",
                mm : "%d分鐘",
                h : "一小時",
                hh : "%d小時",
                d : "一天",
                dd : "%d天",
                M : "一個月",
                MM : "%d個月",
                y : "一年",
                yy : "%d年"
            },
            ordinal : function (number) {
                return '';
            }
        };

    // Node
    if (typeof module !== 'undefined') {
        module.exports = lang;
    }
    // Browser
    if (typeof window !== 'undefined' && this.moment && this.moment.lang) {
        this.moment.lang('zh-tw', lang);
    }
}());
