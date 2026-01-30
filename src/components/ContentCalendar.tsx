import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CalendarEvent {
  id: string;
  title: string;
  scheduled_date: string;
  platform: string;
  status: string;
  notes: string | null;
  idea_id: string | null;
}

interface SavedIdea {
  id: string;
  title: string;
  platform: string;
}

interface ContentCalendarProps {
  savedIdeas: SavedIdea[];
}

const ContentCalendar = ({ savedIdeas }: ContentCalendarProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    scheduled_date: "",
    platform: "TikTok",
    notes: "",
    idea_id: "",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("content_calendar")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: true });
      if (data) setEvents(data);
    };
    fetchEvents();
  }, [user]);

  const handleAddEvent = async () => {
    if (!user || !newEvent.title || !newEvent.scheduled_date) return;

    const { data, error } = await supabase
      .from("content_calendar")
      .insert({
        user_id: user.id,
        title: newEvent.title,
        scheduled_date: newEvent.scheduled_date,
        platform: newEvent.platform,
        notes: newEvent.notes || null,
        idea_id: newEvent.idea_id || null,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Failed to add event", variant: "destructive" });
    } else if (data) {
      setEvents((prev) => [...prev, data].sort((a, b) => 
        new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime()
      ));
      setNewEvent({ title: "", scheduled_date: "", platform: "TikTok", notes: "", idea_id: "" });
      setIsAddingEvent(false);
      toast({ title: "Event added!" });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase.from("content_calendar").delete().eq("id", id);
    if (!error) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Event deleted" });
    }
  };

  const handleMarkComplete = async (id: string) => {
    const { error } = await supabase
      .from("content_calendar")
      .update({ status: "completed" })
      .eq("id", id);
    if (!error) {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "completed" } : e))
      );
      toast({ title: "Marked as complete!" });
    }
  };

  const upcomingEvents = events.filter(
    (e) => new Date(e.scheduled_date) >= new Date() && e.status !== "completed"
  );
  const pastEvents = events.filter(
    (e) => new Date(e.scheduled_date) < new Date() || e.status === "completed"
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Content Calendar
          </CardTitle>
          <CardDescription>
            Plan and schedule your content posts
          </CardDescription>
        </div>
        <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Content</DialogTitle>
              <DialogDescription>
                Add a new item to your content calendar
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Content title"
                />
              </div>

              <div className="space-y-2">
                <Label>Scheduled Date</Label>
                <Input
                  type="date"
                  value={newEvent.scheduled_date}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, scheduled_date: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={newEvent.platform}
                  onValueChange={(value) =>
                    setNewEvent((prev) => ({ ...prev, platform: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {savedIdeas.length > 0 && (
                <div className="space-y-2">
                  <Label>Link to Saved Idea (optional)</Label>
                  <Select
                    value={newEvent.idea_id}
                    onValueChange={(value) =>
                      setNewEvent((prev) => ({ ...prev, idea_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an idea" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedIdeas.map((idea) => (
                        <SelectItem key={idea.id} value={idea.id}>
                          {idea.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={newEvent.notes}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Additional notes..."
                />
              </div>

              <Button onClick={handleAddEvent} className="w-full">
                Add to Calendar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No scheduled content yet.</p>
            <p className="text-sm">Click "Add Event" to start planning.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingEvents.length > 0 && (
              <div>
                <h4 className="font-medium mb-3">Upcoming</h4>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary">{event.platform}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(event.scheduled_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="font-medium truncate">{event.title}</p>
                        {event.notes && (
                          <p className="text-sm text-muted-foreground truncate">
                            {event.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMarkComplete(event.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pastEvents.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground">
                  Completed / Past
                </h4>
                <div className="space-y-2">
                  {pastEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-2 opacity-60"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary" />
                        <span className="text-sm line-through">{event.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.scheduled_date).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentCalendar;
