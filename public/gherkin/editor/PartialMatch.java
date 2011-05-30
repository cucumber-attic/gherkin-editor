package gherkin.editor;

import java.applet.*;
import java.util.regex.*;

public class PartialMatch extends Applet {
  public static boolean isPartialMatch(String regexp, String text) {
		Pattern p = Pattern.compile(regexp);
		Matcher m = p.matcher(text);
		return m.matches() || m.hitEnd();
  }

	public static void main(String[] args) {
		System.out.println(isPartialMatch(args[0], args[1]));
	}
}
