import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useApp } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Star, ThumbsUp, MessageSquare, Search, Flag, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const doctors = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.8, reviews: 124, avatar: null },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'General Practitioner', rating: 4.6, reviews: 89, avatar: null },
  { id: 3, name: 'Dr. Emily Davis', specialty: 'Pediatrician', rating: 4.9, reviews: 156, avatar: null },
  { id: 4, name: 'Dr. Robert Wilson', specialty: 'Dermatologist', rating: 4.5, reviews: 67, avatar: null },
];

const reviews = [
  {
    id: 1,
    doctorId: 1,
    patientName: 'John Smith',
    rating: 5,
    date: '2026-02-10',
    comment: 'Dr. Johnson was incredibly thorough and explained everything clearly. Highly recommend!',
    helpful: 12,
    verified: true,
    tags: ['Professional', 'Knowledgeable'],
  },
  {
    id: 2,
    doctorId: 1,
    patientName: 'Mary Brown',
    rating: 4,
    date: '2026-02-08',
    comment: 'Great experience overall. Wait time was a bit long but the care was excellent.',
    helpful: 8,
    verified: true,
    tags: ['Caring', 'Good Listener'],
  },
  {
    id: 3,
    doctorId: 2,
    patientName: 'David Lee',
    rating: 5,
    date: '2026-02-05',
    comment: 'Dr. Chen took the time to answer all my questions. Very patient and knowledgeable.',
    helpful: 15,
    verified: true,
    tags: ['Patient', 'Thorough'],
  },
];

export function DoctorReviews() {
  const { currentRole: _currentRole } = useApp();
  const [selectedDoctor, setSelectedDoctor] = useState(doctors[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const handleSubmitReview = () => {
    toast.success('Review submitted successfully!');
    setNewReview({ rating: 5, comment: '' });
  };

  const handleHelpful = (_reviewId: number) => {
    toast.success('Marked as helpful');
  };

  const handleReport = (_reviewId: number) => {
    toast.info('Review reported for moderation');
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.doctorId === selectedDoctor.id &&
      (filterRating === null || r.rating === filterRating)
  );

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate?.(star)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0B1B2D] dark:text-white">
            Doctor Reviews
          </h1>
          <p className="text-muted-foreground mt-1">
            Read and write reviews for healthcare providers
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Doctor List */}
          <Card className="hg-card lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Select Doctor</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search doctors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedDoctor.id === doctor.id
                        ? 'bg-[#2F6BFF]/10 border border-[#2F6BFF]/30'
                        : 'hover:bg-secondary'
                    }`}
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF]">
                        {doctor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-medium">{doctor.rating}</span>
                        <span className="text-xs text-muted-foreground">({doctor.reviews})</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <div className="lg:col-span-3 space-y-6">
            {/* Doctor Header */}
            <Card className="hg-card">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-[#2F6BFF]/10 text-[#2F6BFF] text-xl">
                        {selectedDoctor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold">{selectedDoctor.name}</h2>
                      <p className="text-muted-foreground">{selectedDoctor.specialty}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          {renderStars(Math.round(selectedDoctor.rating))}
                          <span className="ml-2 font-bold">{selectedDoctor.rating}</span>
                        </div>
                        <span className="text-muted-foreground">{selectedDoctor.reviews} reviews</span>
                      </div>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="hg-btn-primary">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Write Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Review {selectedDoctor.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div>
                          <Label className="mb-2 block">Your Rating</Label>
                          {renderStars(newReview.rating, true, (r) =>
                            setNewReview({ ...newReview, rating: r })
                          )}
                        </div>
                        <div>
                          <Label className="mb-2 block">Your Review</Label>
                          <Textarea
                            placeholder="Share your experience..."
                            value={newReview.comment}
                            onChange={(e) =>
                              setNewReview({ ...newReview, comment: e.target.value })
                            }
                            className="min-h-[120px]"
                          />
                        </div>
                        <Button onClick={handleSubmitReview} className="w-full hg-btn-primary">
                          Submit Review
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Rating Breakdown */}
            <div className="grid grid-cols-5 gap-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    filterRating === rating
                      ? 'border-[#2F6BFF] bg-[#2F6BFF]/5'
                      : 'border-border hover:border-[#2F6BFF]/30'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {reviews.filter((r) => r.rating === rating).length} reviews
                  </p>
                </button>
              ))}
            </div>

            {/* Reviews List */}
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Reviews</TabsTrigger>
                <TabsTrigger value="verified">Verified</TabsTrigger>
                <TabsTrigger value="positive">Positive</TabsTrigger>
                <TabsTrigger value="critical">Critical</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {filteredReviews.map((review) => (
                  <Card key={review.id} className="hg-card">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-secondary">
                              {review.patientName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.patientName}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {review.verified && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {renderStars(review.rating)}
                        </div>
                      </div>

                      <p className="text-foreground mb-3">{review.comment}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {review.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-3 border-t border-border">
                        <button
                          onClick={() => handleHelpful(review.id)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                        <button
                          onClick={() => handleReport(review.id)}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Flag className="w-4 h-4" />
                          Report
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
