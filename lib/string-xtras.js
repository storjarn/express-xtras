module.exports = {
    trim : function(str) {
        return (str || "").toString().replace(/^\s+|\s+$/g, '');
    },
    /* This file is part of OWL Pluralization.
    http://oranlooney.com/static/inflect/pluralize.js

    OWL Pluralization is free software: you can redistribute it and/or
    modify it under the terms of the GNU Lesser General Public License
    as published by the Free Software Foundation, either version 3 of
    the License, or (at your option) any later version.

    OWL Pluralization is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public
    License along with OWL Pluralization.  If not, see
    <http://www.gnu.org/licenses/>.
    */

    pluralize : (function() {
        var userDefined = {};

        function capitalizeSame(word, sampleWord) {
            if ( sampleWord.match(/^[A-Z]/) ) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            } else {
                return word;
            }
        }

        // returns a plain Object having the given keys,
        // all with value 1, which can be used for fast lookups.
        function toKeys(keys) {
            keys = keys.split(',');
            var keysLength = keys.length;
            var table = {};
            for ( var i=0; i < keysLength; i++ ) {
                table[ keys[i] ] = 1;
            }
            return table;
        }

        // words that are always singular, always plural, or the same in both forms.
        var uninflected = toKeys("aircraft,advice,blues,corn,molasses,equipment,gold,information,cotton,jewelry,kin,legislation,luck,luggage,moose,music,offspring,rice,silver,trousers,wheat,bison,bream,breeches,britches,carp,chassis,clippers,cod,contretemps,corps,debris,diabetes,djinn,eland,elk,flounder,gallows,graffiti,headquarters,herpes,high,homework,innings,jackanapes,mackerel,measles,mews,mumps,news,pincers,pliers,proceedings,rabies,salmon,scissors,sea,series,shears,species,swine,trout,tuna,whiting,wildebeest,pike,oats,tongs,dregs,snuffers,victuals,tweezers,vespers,pinchers,bellows,cattle,money,fish,sheep,deer");

        var irregular = {
            // pronouns
            I: 'we',
            you: 'you',
            he: 'they',
            it: 'they',  // or them
            me: 'us',
            him: 'them',
            them: 'them',
            myself: 'ourselves',
            yourself: 'yourselves',
            himself: 'themselves',
            herself: 'themselves',
            itself: 'themselves',
            themself: 'themselves',
            oneself: 'oneselves',

            child: 'children',
            dwarf: 'dwarfs',  // dwarfs are real; dwarves are fantasy.
            mongoose: 'mongooses',
            mythos: 'mythoi',
            ox: 'oxen',
            soliloquy: 'soliloquies',
            trilby: 'trilbys',
            person: 'people',
            forum: 'forums', // fora is ok but uncommon.

            // latin plural in popular usage.
            syllabus: 'syllabi',
            alumnus: 'alumni',
            genus: 'genera',
            viscus: 'viscera',
            stigma: 'stigmata'
        };

        var suffixRules = [
            // common suffixes
            // [ /man$/i, 'men' ],
            [ /(m)an$/gi, '$1en'],
            [ /([lm])ouse$/i, '$1ice' ],
            [ /tooth$/i, 'teeth' ],
            [ /goose$/i, 'geese' ],
            [ /foot$/i, 'feet' ],
            [ /zoon$/i, 'zoa' ],
            [ /([tcsx])is$/i, '$1es' ],

            // fully assimilated suffixes
            [ /ix$/i, 'ices' ],
            [ /^(cod|mur|sil|vert)ex$/i, '$1ices' ],
            [ /^(agend|addend|memorand|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi)um$/i, '$1a' ],
            [ /^(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|\w+hedr)on$/i, '$1a' ],
            [ /^(alumn|alg|vertebr)a$/i, '$1ae' ],

            // churches, classes, boxes, etc.
            [ /([cs]h|ss|x)$/i, '$1es' ],

            // words with -ves plural form
            [ /([aeo]l|[^d]ea|ar)f$/i, '$1ves' ],
            [ /([nlw]i)fe$/i, '$1ves' ],

            // -y
            [ /([aeiou])y$/i, '$1ys' ],
            [ /(^[A-Z][a-z]*)y$/, '$1ys' ], // case sensitive!
            [ /y$/i, 'ies' ],

            // -o
            [ /([aeiou])o$/i, '$1os' ],
            [ /^(pian|portic|albin|generalissim|manifest|archipelag|ghett|medic|armadill|guan|octav|command|infern|phot|ditt|jumb|pr|dynam|ling|quart|embry|lumbag|rhin|fiasc|magnet|styl|alt|contralt|sopran|bass|crescend|temp|cant|sol|kimon)o$/i, '$1os' ],
            [ /o$/i, 'oes' ],

            // words ending in s...
            [ /s$/i, 'ses' ],

            [/(pe)rson$/gi, '$1ople'],
            [/(child)$/gi, '$1ren'],
            [/^(ox)$/gi, '$1en'],
            [/(ax|test)is$/gi, '$1es'],
            [/(octop|vir)us$/gi, '$1i'],
            [/(alias|status)$/gi, '$1es'],
            [/(bu)s$/gi, '$1ses'],
            [/(buffal|tomat|potat)o$/gi, '$1oes'],
            [/([ti])um$/gi, '$1a'],
            [/sis$/gi, 'ses'],
            [/(?:([^f])fe|([lr])f)$/gi, '$1$2ves'],
            [/(hive)$/gi, '$1s'],
            [/([^aeiouy]|qu)y$/gi, '$1ies'],
            [/(x|ch|ss|sh)$/gi, '$1es'],
            [/(matr|vert|ind)ix|ex$/gi, '$1ices'],
            [/([m|l])ouse$/gi, '$1ice'],
            [/(kn|w|l)ife$/gi, '$1ives'],
            [/(quiz)$/gi, '$1zes'],
            [/s$/gi, 's'],
            [/([^a-z])$/, '$1'],
            [/$/gi, 's']
        ];

        // pluralizes the given singular noun.  There are three ways to call it:
        //   pluralize(noun) -> pluralNoun
        //     Returns the plural of the given noun.
        //   Example:
        //     pluralize("person") -> "people"
        //     pluralize("me") -> "us"
        //
        //   pluralize(noun, count) -> plural or singular noun
        //   Inflect the noun according to the count, returning the singular noun
        //   if the count is 1.
        //   Examples:
        //     pluralize("person", 3) -> "people"
        //     pluralize("person", 1) -> "person"
        //     pluralize("person", 0) -> "people"
        //
        //   pluralize(noun, count, plural) -> plural or singular noun
        //   you can provide an irregular plural yourself as the 3rd argument.
        //   Example:
        //     pluralize("chÃ¢teau", 2 "chÃ¢teaux") -> "chÃ¢teaux"
        function pluralize(word, count, plural) {
            // handle the empty string reasonably.
            if ( word === '' ) return '';

            // singular case.
            if ( count === 1 ) return word;

            // life is very easy if an explicit plural was provided.
            if ( typeof plural === 'string' ) return plural;

            var lowerWord = word.toLowerCase();

            if (!~pluralize.uncountables.indexOf(lowerWord)){
                // user defined rules have the highest priority.
                if ( lowerWord in userDefined ) {
                    return capitalizeSame(userDefined[lowerWord], word);
                }

                // single letters are pluralized with 's, "I got five A's on
                // my report card."
                if ( word.match(/^[A-Z]$/) ) return word + "'s";

                // some word don't change form when plural.
                if ( word.match(/fish$|ois$|sheep$|deer$|pox$|itis$/i) ) return word;
                if ( word.match(/^[A-Z][a-z]*ese$/) ) return word;  // Nationalities.
                if ( lowerWord in uninflected ) return word;

                // there's a known set of words with irregular plural forms.
                if ( lowerWord in irregular ) {
                    return capitalizeSame(irregular[lowerWord], word);
                }

                // try to pluralize the word depending on its suffix.
                var suffixRulesLength = suffixRules.length;
                for ( var i=0; i < suffixRulesLength; i++ ) {
                    var rule = suffixRules[i];
                    if ( word.match(rule[0]) ) {
                        return word.replace(rule[0], rule[1]);
                    }
                }

                // if all else fails, just add s.
                return word + 's';
            }

            return word;
        }

        pluralize.define = function(word, plural) {
            userDefined[word.toLowerCase()] = plural;
        };

        pluralize.uncountables = [
          'advice',
          'energy',
          'excretion',
          'digestion',
          'cooperation',
          'health',
          'justice',
          'labour',
          'machinery',
          'equipment',
          'information',
          'pollution',
          'sewage',
          'paper',
          'money',
          'species',
          'series',
          'rain',
          'rice',
          'fish',
          'sheep',
          'moose',
          'deer',
          'news',
          'expertise',
          'status',
          'media'
        ];

        return pluralize;

    })(),

    singularize: function(word, count, plural) {
        /*
          These rules translate from the plural form of a noun to its singular form.
        */
        // singular_rules: [
        //     [new RegExp('(m)en$', 'gi'),                                                       '$1an'],
        //     [new RegExp('(pe)ople$', 'gi'),                                                    '$1rson'],
        //     [new RegExp('(child)ren$', 'gi'),                                                  '$1'],
        //     [new RegExp('([ti])a$', 'gi'),                                                     '$1um'],
        //     [new RegExp('((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi'), '$1$2sis'],
        //     [new RegExp('(hive)s$', 'gi'),                                                     '$1'],
        //     [new RegExp('(tive)s$', 'gi'),                                                     '$1'],
        //     [new RegExp('(curve)s$', 'gi'),                                                    '$1'],
        //     [new RegExp('([lr])ves$', 'gi'),                                                   '$1f'],
        //     [new RegExp('([^fo])ves$', 'gi'),                                                  '$1fe'],
        //     [new RegExp('([^aeiouy]|qu)ies$', 'gi'),                                           '$1y'],
        //     [new RegExp('(s)eries$', 'gi'),                                                    '$1eries'],
        //     [new RegExp('(m)ovies$', 'gi'),                                                    '$1ovie'],
        //     [new RegExp('(x|ch|ss|sh)es$', 'gi'),                                              '$1'],
        //     [new RegExp('([m|l])ice$', 'gi'),                                                  '$1ouse'],
        //     [new RegExp('(bus)es$', 'gi'),                                                     '$1'],
        //     [new RegExp('(o)es$', 'gi'),                                                       '$1'],
        //     [new RegExp('(shoe)s$', 'gi'),                                                     '$1'],
        //     [new RegExp('(cris|ax|test)es$', 'gi'),                                            '$1is'],
        //     [new RegExp('(octop|vir)i$', 'gi'),                                                '$1us'],
        //     [new RegExp('(alias|status)es$', 'gi'),                                            '$1'],
        //     [new RegExp('^(ox)en', 'gi'),                                                      '$1'],
        //     [new RegExp('(vert|ind)ices$', 'gi'),                                              '$1ex'],
        //     [new RegExp('(matr)ices$', 'gi'),                                                  '$1ix'],
        //     [new RegExp('(quiz)zes$', 'gi'),                                                   '$1'],
        //     [new RegExp('s$', 'gi'),                                                           '']
        // ],
    }
};
