from django.db import models
from . import Task

class Post(models.Model):
    """
    POST MODEL FOR STORING WORK HOURS AND COMMENTS FOR TASKS
    """
    post_id = models.AutoField(primary_key=True)
    assigned_task = models.ForeignKey(Task, on_delete=models.CASCADE)                            # task_id
    post_date = models.DateTimeField()
    work_hours = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Post #{self.post_id} for Task #{self.assigned_task.name}"

    def save(self, *args, **kwargs):
        """
        TOTAL_HOURS AUTO SUM LOGIC
        """
        super().save(*args, **kwargs)

        task = self.assigned_task
        total = Post.objects.filter(assigned_task=task).aggregate(
            models.Sum('work_hours')
        )['work_hours__sum'] or 0.0
        task.total_hours = total
        task.save()