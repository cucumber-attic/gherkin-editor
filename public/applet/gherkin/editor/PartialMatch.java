package gherkin.editor;

import java.applet.*;
import java.util.regex.*;

// http://stackoverflow.com/questions/2469231/how-can-i-perform-a-partial-match-with-java-util-regex
public class PartialMatch extends Applet {
    // TODO: return an enum: NO_MATCH | EXACT_MATCH | PARTIAL_MATCH
    // Might be useful for autocomplete to make better decisions.
    public static boolean isPartialMatch(String regexp, String text) {
        Pattern p = Pattern.compile(regexp);
        Matcher m = p.matcher(text);
        return m.matches() || m.hitEnd();
    }

    public static void main(String[] args) {
        System.out.println(isPartialMatch(args[0], args[1]));
    }
}
