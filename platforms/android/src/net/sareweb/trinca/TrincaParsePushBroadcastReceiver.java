package net.sareweb.trinca;

import com.parse.ParsePushBroadcastReceiver;
import android.util.Log;
import android.content.Intent;
import android.content.Context;
import net.sareweb.trinca.Trinca;

public class TrincaParsePushBroadcastReceiver extends ParsePushBroadcastReceiver {

    @Override
    public void onPushOpen(Context context, Intent intent) {
        Log.e("Push", "Clicked");
        Intent i = new Intent(context, Trinca.class);
        i.putExtras(intent.getExtras());
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(i);
    }
}