package net.sareweb.trinca;

import android.app.Application;
import android.util.Log;

import com.parse.Parse;
import com.parse.ParsePush;
import com.parse.ParseException;
import com.parse.SaveCallback;

public class TrincaApplication extends Application {

	private static String TAG = "TrincaApplication";

	@Override
	public void onCreate() {
		super.onCreate();
		Log.d(TAG, "Parse push things");
		Parse.initialize(this, "OlBVD14oguSdo4Q5DSHPXGQ3SNT599AV9vPGfidO", "3Sd48lxXHvqtJLig6HYOHbUlez8z90SrXBZlWzUi");
		
		ParsePush.subscribeInBackground("", new SaveCallback() {
  			@Override
  			public void done(ParseException e) {
    			if (e != null) {
      				Log.d(TAG, "successfully subscribed to the broadcast channel.");
    			} else {
      				Log.e(TAG, "failed to subscribe for push", e);
    			}
  			}
		});

    }
}