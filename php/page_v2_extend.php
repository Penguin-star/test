<?php
/**
 * User: pmsun
 * Date: 13-12-16
 * Time: 下午11:33
 * Desc: 分页类
 * Usage:
 *  $page_template = array(
 *  'blur'  => '<a href="%url%">%page%</a>',//非当前页样式
 *  'focus' => '<span>%page%</span>',//当前页样式
 *  'prev'  => '<a href="%url%">上一页</a>',//上一页样式
 *  'next'  => '<a href="%url%">下一页</a>',//下一页样式
 *  'dian'  => '<span>...</span>'//...样式，可省略
 *  );
 *  $page = new Page(3, $page_template, array("a" => "1", "b" => 2));
 *  echo $page->create($current_page);
 *
 * change: xieliang扩展支持 $template 里的page,url变量
 */

include_once('extend.php');
class Page_v2_extend extends Extend {
    //当前页码
    protected $page;
    //总数
    protected $total;
    //总页数
    protected $total_page;
    //每页显示数量
    protected $per_page;
    //页码显示的数量
    protected $page_size;
    //用于构造地址的参数，例如一些查询条件
    protected $url_array;
    //分页的html模版
    protected $template;

    public function __construct($total, $template = array(), $url_array = array(), $page_size = 5, $per_page = 5) {
        $this->page = 1;
        $this->total = $total;
        $this->page_size = $page_size;
        $this->per_page = $per_page;
        $this->total_page = intval(ceil($total / $per_page));
        if(!empty($url_array)){//如果url数组不为空,则去除page的参数
            unset($url_array['page']);
        }
        $this->url_array = $url_array;
        //定义默认的样式
        $page_template = array(
            'blur'  => '<a href="%url%">%page% </a>', //非当前页样式
            'focus' => '<span>%page% </span>', //当前页样式
            'prev'  => '<a href="%url%">上一页 </a>', //上一页样式
            'next'  => '<a href="%url%"> 下一页</a>', //下一页样式
        );
        $this->template = empty($template) ? $page_template : $template;
    }

    public function create($page) {
        $this->page = $page <= $this->total_page ? $page : $this->total_page; //超过总页数，则定位在最后一页
        $page_half = intval($this->page_size / 2);
        $page_start = $this->page <= $this->total_page && $this->total_page > $this->page_size ? max(1, $this->page - $page_half) : 1;
        $page_end = min($page_start + $this->page_size - 1, $this->total_page);
        $page_start = $page_end == $this->total_page && $this->total_page > $this->page_size ? $page_end - $this->page_size + 1 : $page_start;

        //在这转下,以方便站replace_str里直接替换
        if(empty($this->url_array)){
            $this->url_array = "?";
        } else {
            $this->url_array = "?" . http_build_query($this->url_array) . "&";
        }
        return $this->pageHtml($page_start, $page_end);
    }

    /**
     * 替换字符
     */
    protected function replace_str ($str, $page){
        //如果为空
        if(empty($str)){
            return "";
        }

        //相加
        $url = $this->url_array . "page=". $page;

        //替换整个连接
        $str = str_replace("%url%", $url , $str);

        //替换page参数
        $str = str_replace("%page%", $page, $str);

        return $str;
    }

    protected function pageHtml($page_start, $paga_end) {
        $page_array = range($page_start, $paga_end);
        $page_html = "";
        if (!empty($page_array) && $this->total_page > 1) {
            $this->page = $this->total_page >= $this->page ? $this->page : 1;

            //上一页
            $page_html .= $this->page > 1 && isset($this->template['prev']) ?  $this->replace_str($this->template['prev'], $this->page - 1) : "";

            //判断显示1...
            if ($page_start >= 2 && isset($this->template['dian'])) {
                $page_html .= $this->replace_str($this->template['blur'], 1);
                $page_html .= $this->template['dian'];
            }

            //循环中间的页码
            foreach ($page_array as $p) {
                if ($this->page == $p) {
                    $page_html .= $this->replace_str($this->template['focus'], $p);
                } else {
                    $page_html .= $this->replace_str($this->template['blur'], $p);
                }
            }

            //判断显示...100
            if ($paga_end < $this->total_page && isset($this->template['dian'])) {
                $page_html .= $this->template['dian'];
                $page_html .= $this->replace_str($this->template['blur'], $this->total_page);
            }

            //下一页
            $page_html .= $this->page < $this->total_page && isset($this->template['next']) ? $this->replace_str($this->template['next'], $this->page + 1) : "";
        }
        return $page_html;
    }
}